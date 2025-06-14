import { useRef, useEffect, useState } from 'react';

type Polygon = {
  name: string;
  points: { lat: number; long: number }[];
};

const polygons: Polygon[] = [
  {
    name: 'New Cebu',
    points: [
      { lat: 7.103434, long: 125.015181 },
      { lat: 7.095113, long: 125.059113 },
      { lat: 7.081896, long: 125.055215 },
      { lat: 7.088119, long: 125.031714 },
    ],
  },
  {
    name: 'Del Carmen National Road',
    points: [
      { lat: 7.104125, long: 125.044137 },
      { lat: 7.115218, long: 125.047275 },
      { lat: 7.116433, long: 125.044564 },
      { lat: 7.105537, long: 125.040714 },
    ],
  },
  {
    name: 'Del Carmen',
    points: [
      { lat: 7.113824, long: 125.044968 },
      { lat: 7.126276, long: 125.029640 },
      { lat: 7.105394, long: 125.014189 },
      { lat: 7.102659, long: 125.041444 },
    ],
  },
  {
    name: 'Labuo',
    points: [
      { lat: 7.118546, long: 125.045911 },
      { lat: 7.140821, long: 125.051954 },
      { lat: 7.147910, long: 125.021888 },
      { lat: 7.134935, long: 125.020215 },
    ],
  },
];

function isPointInPolygon(point: { lat: number; long: number }, polygon: { lat: number; long: number }[]) {
  let inside = false;
  const { lat, long } = point;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat, yi = polygon[i].long;
    const xj = polygon[j].lat, yj = polygon[j].long;

    const intersect =
      yi > long !== yj > long &&
      lat < ((xj - xi) * (long - yi)) / (yj - yi + 0.0000001) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

const LocateIncident = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [status, setStatus] = useState('');
  const [matchedPolygons, setMatchedPolygons] = useState<Polygon[]>([]);
  const [inputPoint, setInputPoint] = useState<{ lat: number; long: number } | null>(null);

  const checkPoint = () => {
    const lat = parseFloat(inputX);
    const long = parseFloat(inputY);
    if (isNaN(lat) || isNaN(long)) {
      setStatus('Enter valid coordinates');
      setMatchedPolygons([]);
      return;
    }

    const point = { lat, long };
    setInputPoint(point);

    const matched = polygons.filter(poly => isPointInPolygon(point, poly.points));
    setMatchedPolygons(matched);

    if (matched.length > 0) {
      const polygonNames = matched.map(poly => poly.name).join(', ');
      setStatus(`Point is inside: ${polygonNames}`);
    } else {
      setStatus('Point is outside all polygons');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const minLat = Math.min(...polygons.flatMap(p => p.points.map(pt => pt.lat))) - 0.01;
    const maxLat = Math.max(...polygons.flatMap(p => p.points.map(pt => pt.lat))) + 0.01;
    const minLong = Math.min(...polygons.flatMap(p => p.points.map(pt => pt.long))) - 0.01;
    const maxLong = Math.max(...polygons.flatMap(p => p.points.map(pt => pt.long))) + 0.01;

    const scaleX = canvas.width / (maxLong - minLong);
    const scaleY = canvas.height / (maxLat - minLat);

    polygons.forEach(poly => {
      ctx.beginPath();
      poly.points.forEach((point, index) => {
        const x = (point.long - minLong) * scaleX;
        const y = canvas.height - (point.lat - minLat) * scaleY;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      ctx.strokeStyle = 'blue';
      ctx.stroke();
      if (matchedPolygons.some(matched => matched.name === poly.name)) {
        ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
        ctx.fill();
      }
    });

    if (inputPoint) {
      const x = (inputPoint.long - minLong) * scaleX;
      const y = canvas.height - (inputPoint.lat - minLat) * scaleY;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    }
  }, [inputPoint, matchedPolygons]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Point in Polygon (Canvas Map)</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Latitude"
          value={inputX}
          onChange={(e) => setInputX(e.target.value)}
          className="border p-2 w-24"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={inputY}
          onChange={(e) => setInputY(e.target.value)}
          className="border p-2 w-24"
        />
        <button
          onClick={checkPoint}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Check
        </button>
      </div>
      <p className="mb-4">{status}</p>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="border w-full bg-gray-50"
      />
    </div>
  );
};

export default LocateIncident;