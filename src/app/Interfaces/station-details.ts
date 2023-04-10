export interface StationDetails {
    id?:string;
    name: string;
    address: string;
    location: {
      x: number;
      y: number;
    };
    departureJourneyCount: number;
    returnJourneyCount: number;
    averageDistanceOfDepartureJourneys: number;
    averageDistanceOfReturnJourneys: number;
    //top5DepartureStations: { id: string, count: number }[];
    //top5ReturnStations: { id: string,name: string, address: string, count: number }[];
    top5DepartureStations: { [key: string]: number };
    top5ReturnStations: { [key: string]: number };
  }
  export interface StationAddress {
    id?:string;
    name: string;
    address: string;
  }
  export interface Station {
    message(message: any): unknown;
    fid?: number;
    id: number;
    nimi: string;
    namn: string;
    name: string;
    osoite: string;
    address: string;
    kaupunki: string;
    stad: string;
    operaattor: string;
    kapasiteet: string;
    x?: number;
    y?: number;
    departureJourneys?: StationDetails[];
    returnJourneys?: StationDetails[];
    [key: string]: any;
  }
  export interface Journey {
    [x: string]: any;
    id: number;
    departure: Date | null | undefined;
    return: Date | null | undefined;
    departureStationId: number;
    returnStationId: number;
    coveredDistanceInMeters: number;
    durationInSeconds: number;
    departureStation?: Station;
    returnStation?: Station;
    users: UserInfo| null | undefined;
  }
  export interface UserInfo{
    id:number;
    firstname: string; 
    lastname: string;
    username: string;
    email: string;
  }
  export interface UserJourneys {
    userInfo: UserInfo;
    journeys: Journey[];
  }
  
  