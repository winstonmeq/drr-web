'use client';

import React, { useEffect, useState } from 'react';
import { FaSquare } from 'react-icons/fa';

const WebMap = () => {
  const [selected, setSelected] = useState<string | null>(null);
 

  const [colors, setColors] = useState<{ [key: string]: string }>({});



  // Define colors based on emergency status
  const getColorFromAlert = (alert: string) => {
    switch (alert) {
      case 'Red Alert':
        return '#ff0000'; // red
      case 'Blue Alert':
        return '#0000ff'; // blue
      default:
        return '#c4bf89'; // default
    }
  };

  useEffect(() => {

    const municipalities = [
        { municipality: 'Alamada', emergency: 'Red Alert' },
        { municipality: 'Pigcawayan', emergency: 'Blue Alert' },
      ];

    const fillColors: { [key: string]: string } = {};
    municipalities.forEach((m) => {
      const key = m.municipality.toLowerCase(); // to match id format
      fillColors[key] = getColorFromAlert(m.emergency);
    });
    setColors(fillColors);
  }, []);

  

  return (
    <main className="min-h-screen bg-gray-50 p-5 flex flex-col lg:flex-row items-center justify-center gap-6">
      {/* Map Container */}
      <div className="w-full max-w-7xl">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
         <path
          id="svg_2"
          d="m259.93749,230.79452l49.81251,-2.79452l19,-69.75093l-24,-96.03389l-61,-37.40267l-57,32.34826l-1,58.63122l59.3125,67.4546l14.87499,47.54794z"
          opacity="undefined"
          stroke="#000"
          fill={colors['alamada'] || '#c4bf89'}
          onClick={() => setSelected("ALAMADA")}
          className="cursor-pointer hover:fill-green-600 transition"
        >
          <title>Alamada</title>
        </path>

        <path
          id="pigcawayan"
          d="m129.99999,314.19999l22.00001,9.80001c0.99999,0.19999 55.99999,-49.80001 55.99999,-49.80001c0,0 12,-119 11.00001,-119.19999c0.99999,0.19999 -52.00001,96.19999 -89.00001,159.19999z"
          opacity="undefined"
          stroke="#000"
          fill={colors['pigcawayan'] || '#c4bf89'}
          onClick={() => setSelected("PIGCAWAYAN")}
          className="cursor-pointer hover:fill-green-600 transition"
        />
        <path
          id="svg_9"
          d="m304.06249,61.43751l44.06251,-13.00001l59.6875,25l-14.0625,68.125l-26.25,52.8125l-58.125,32.1875l18.75,-70l-24.06251,-95.12499z"
          opacity="undefined"
          stroke="#000"
             fill="#c4bf89"
        />
        <path
          id="svg_10"
          d="m309.68749,226.43748c0,0 59.0625,-31.875 58.75001,-32.06249c0.31249,0.18749 26.87499,-54.50001 26.5625,-54.6875c0.31249,0.18749 11.87499,-7.31251 11.5625,-7.5c0.31249,0.18749 70.31249,38.62499 70,38.4375c0.31249,0.18749 4.37499,34.87499 4.0625,34.6875c0.31249,0.18749 -59.37501,52.37499 -59.6875,52.1875c0.31249,0.18749 -23.43751,72.99999 -23.75,72.8125c0.31249,0.18749 -51.87501,-22.62501 -52.1875,-22.8125c0.31249,0.18749 -42.50001,-45.43751 -42.8125,-45.625c0.31249,0.18749 7.49999,-35.43751 7.49999,-35.43751z"
          opacity="NaN"
          stroke="#000"
            fill="#c4bf89"
        />
        <path
          id="svg_13"
          d="m219.39393,154.1212l26.06062,27.69698l14.24242,48.48485l49.09091,-2.42424c0.30302,0.1818 -10.00001,45.93938 -10.00001,45.93938c0,0 -64.84849,9.39394 -65.1515,9.21214c0.30301,0.1818 -25.15153,-10.12124 -25.45455,-10.30303l5.30302,-57.48486l5.90909,-61.12122z"
          opacity="NaN"
          stroke="#000"
             fill="#c4bf89"
        />
        <path
          id="svg_14"
          d="m285.1515,275.33332l-51.51514,7.09093l-44.54546,82.12121l66.9697,40l6.66667,-100.30303l21.81818,-1.51515l0.60605,-27.39396z"
          opacity="NaN"
          stroke="#000"
             fill="#c4bf89"
        />
        <path
          id="svg_15"
          d="m259.39393,353.51513l33.63638,-3.81816l24.54545,-20.60606l24.24242,-24.54545l-40.30303,-43.33333l-3.33333,12.72727l-13.93939,1.21212l-2.12121,26.9697l-19.39394,2.12121l-3.33335,49.27271z"
          opacity="NaN"
          stroke="#000"
           fill="#c4bf89"
        />
        <path
          id="svg_17"
          d="m342.42423,304.72726c0,0 22.72727,55.15151 22.42426,54.96972c0.30301,0.1818 -23.03032,24.72725 -23.33333,24.54545c0.30301,0.18179 8.78786,36.2424 8.48485,36.06061c0.30301,0.18179 -26.66668,28.06058 -26.9697,27.87879c0.30301,0.18179 -56.06062,-24.06063 -56.36364,-24.24242c0.30302,0.18179 -10.30304,-18.30305 -10.60606,-18.48485c0.30302,0.18179 3.63635,-51.33336 3.33333,-51.51515c0.30302,0.1818 35.45453,-4.66669 35.15152,-4.84848c0.30302,0.1818 47.87877,-44.36366 47.87877,-44.36366z"
          opacity="NaN"
          stroke="#000"
           fill="#c4bf89"
        />
        <path
          id="svg_18"
          d="m344.24241,306.24241l49.39396,44.06063l-2.42424,66.36364l36.06061,0l26.36364,-95.75758l-33.0303,-64.24243l-20.30303,63.33333l-56.06062,-13.7576z"
          opacity="NaN"
          stroke="#000"
           fill="#c4bf89"
        />
        <path
          id="svg_19"
          d="m403.63637,465.45455c0.30301,0.18179 39.09089,25.63634 39.39392,25.63634c0.30303,0 45.45455,0.60606 45.45455,0.30303c0,-0.30303 33.33333,-17.87879 33.03032,-18.06058c0.30301,0.18179 -23.03032,-78.30305 -23.33333,-78.48485l-63.86364,-2.72727l-6.28788,24.54546l-37.19697,0l12.80303,48.78787z"
          opacity="NaN"
          stroke="#000"
          fill="#c4bf89"
        />
        <path
          id="svg_20"
          d="m405.45453,542.60604c0,-0.30303 48.78788,-4.84848 48.48487,-5.03027c0.30301,0.18179 60.60604,35.93936 60.90907,35.93936c0.30303,0 64.54545,-20.60606 64.24245,-20.78785c0.303,0.18179 -0.00003,-39.81821 -0.30303,-40c0.303,0.18179 -56.06063,-39.81821 -56.36364,-40l-33.63638,18.87877l-45.90909,-0.40909l-39.62122,-25.50758l2.19697,76.91666z"
          opacity="NaN"
          stroke="#000"
            fill="#c4bf89"
        />
        <path
          id="svg_21"
          d="m497.33332,395.2l6.22223,-64.08889l20.44444,-40.44444l-49.77778,0.88889c0.44443,0.08889 -0.8889,-80.35556 -0.8889,-80.35556c0,0 -52.44444,45.77778 -52.88888,45.68889c0.44443,0.08889 32.88888,62.75555 32.44444,62.66667c0.44443,0.08889 -18.66668,72.08889 -19.11111,72l63.55554,3.64444z"
          opacity="NaN"
          stroke="#000"
               fill="#c4bf89"
        />
        <path
          id="svg_22"
          d="m479.99999,204.97778c0,0 31.11111,-1.77778 30.66668,-1.86667c0.44443,0.08889 2.66666,24.08889 2.22222,24c0.44443,0.08889 61.33332,-1.24445 60.88889,-1.33333c0.44443,0.08889 -0.8889,46.75555 -1.33333,46.66667c0.44443,0.08889 -36.00001,-0.35556 -36.44444,-0.44444c0.44443,0.08889 -11.55557,18.31111 -12,18.22222c0.44443,0.08889 -50.22223,0.97778 -50.66667,0.88889c0.44443,0.08889 -0.44446,-79.91111 -0.44446,-79.91111l7.11111,-6.22222z"
          opacity="NaN"
          stroke="#000"
           fill="#c4bf89"
        />
        <path
          id="president_roxas1"
          d="m478.66665,176.53333l60.8889,6.13333l11.11111,-26.22222l29.77778,1.33333l-6.22222,68l-61.33333,0.44444l-1.77778,-24l-31.55556,1.77778l-0.8889,-27.46667z"
          opacity="NaN"
          stroke="#000"
           fill="#c4bf89"
        />
        <path
          id="svg_24"
          d="m580.88887,158.31111l39.11112,-78.31111l39.11111,3.55556l-7.11111,117.77778l-10.66667,15.55556l2.22222,94.66667l-36.88889,1.77778l2.22222,-40l-36.88889,-0.88889l0.88889,-47.11111l7.99999,-67.02222z"
          opacity="NaN"
          stroke="#000"
          fill="#c4bf89"
        />
        <path
          id="president_roxas2"
          d="m503.1111,352.97777l44.00001,14.57778l10.66667,-59.11111l14.66667,-36.44444l-36,-0.44444c0.44443,0.08889 -12.8889,18.31111 -12.8889,18.31111c0,0 -20.44444,40.44444 -20.88888,40.35556l0.44443,22.75555z"
          opacity="NaN"
          stroke="#000"
          fill="#c4bf89"
        />
        <path
          id="svg_26"
          d="m507.99999,427.19999l125.33334,-12.53333l7.55556,-21.33333c0.44443,0.08889 -93.77779,-26.57778 -93.77779,-26.57778c0,0 -44,-13.77778 -44.44443,-13.86666c0.44443,0.08889 -5.77779,40.08889 -6.22222,40l11.55554,34.31111z"
          opacity="NaN"
          stroke="#000"
            fill="#c4bf89"
        />
        <path
          id="svg_28"
          d="m662.22221,416.08888l-2.22221,19.91111l-68.44444,81.33333l-12.44444,-5.77778l-57.77778,-39.55556l-14.22222,-45.77778l126.22222,-12.44444l28.88888,2.31111z"
          opacity="NaN"
          stroke="#000"
             fill="#c4bf89"
        />
        <path
          id="svg_29"
          d="m633.33332,412.97777c0,0 29.77778,3.11111 29.33334,3.02223c0.44444,0.08888 18.66666,-59.91112 18.22223,-60c0.44443,0.08888 -36.88891,-45.68889 -37.33334,-45.77778c0.44443,0.08889 -36.44445,2.31111 -36.88889,2.22222c0.44444,0.08889 1.77777,-39.91111 1.33334,-40c0.44443,0.08889 -36.44446,-0.8 -36.88889,-0.88889c0.44443,0.08889 -12.8889,36.97778 -13.33334,36.88889c0.44444,0.08889 -10.66667,58.75556 -10.66667,58.75556l92.44444,26l-6.22222,19.77777z"
          opacity="NaN"
          stroke="#000"
              fill="#c4bf89"
        />


        <text x="230" y="130" fill="#aafff" fontSize="10" fontWeight="bold">
          ALAMADA
        </text>

        <text x="330" y="130" fill="#1e3a8a" fontSize="10" fontWeight="bold">
          BANISILAN
        </text>

        <text x="370" y="240" fill="#aafff" fontSize="10" fontWeight="bold">
          CARMEN
        </text>

        <text x="130" y="280" fill="#1e3a8a" fontSize="10" fontWeight="bold">
          PIGCAWAYAN
        </text>

        <text x="230" y="250" fill="#1e3a8a" fontSize="10" fontWeight="bold">
          LIBUNGAN
        </text>

        <text x="200" y="340" fill="#1e3a8a" fontSize="10" fontWeight="bold">
          MIDSAYAP
        </text>

        </svg>
      </div>

      {/* Info Panel */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 space-y-6">
        {selected ? (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{selected}</h2>
            <p className="text-gray-600 text-sm">
              Detailed information about <span className="font-semibold">{selected}</span> will be shown here.
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500 italic">
            Click on a municipality to view details.
          </div>
        )}

        {/* Legend */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Legend</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">Red Alert</p>
              <FaSquare size={20} color="red" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">Blue Alert</p>
              <FaSquare size={20} color="blue" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WebMap;
