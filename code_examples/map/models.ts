type CoordinateItem = {
    lat: number;
    lng: number;
};

type MarkerIconAnchor =  {
    x: number;
    y: number;
};

type MarkerIconScaledSize =  {
    width: number;
    height: number;
};

type MarkerIcon = {
    url: string;
    scaledSize?: MarkerIconScaledSize;
    anchor: MarkerIconAnchor;
};

type PolylineIcon = {
    path: string;
    strokeOpacity: number;
    scale: number;
};

type PolylineIconStyleOptions = {
    icon: PolylineIcon;
    offset: string;
    repeat: string;
};


type PolylineStyleOptions = {
    strokeColor: string;
    strokeOpacity: 1.0;
    strokeWeight: 3;
    icons: PolylineIconStyleOptions[];
}


export {CoordinateItem, MarkerIcon, PolylineStyleOptions}