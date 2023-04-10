import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Journey, Station, StationAddress, StationDetails, UserJourneys } from '../Interfaces/station-details';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  [x: string]: any;
private baseUrl:string='http://20.105.92.237/api';
  constructor(private http:HttpClient) { }
  getUsers(){
    return this.http.get<any>(this.baseUrl);
  }



  public getStationDetails(id: string, month: string): Observable<StationDetails> {
    //const params = new HttpParams().set('id', id).set('month', month);
    let params = new HttpParams();
    params = params.append('id', id.toString());
    params = params.append('month', month.toString());
    return this.http.get(`${this.baseUrl}/Singleview/${id}`, { params: params }).pipe(
      map((data: any) => {
        const stationDetails: StationDetails = {
          name: data.name,
          address: data.address,
          location: data.location,
          departureJourneyCount: data.departureJourneyCount,
          returnJourneyCount: data.returnJourneyCount,
          averageDistanceOfDepartureJourneys: data.averageDistanceOfDepartureJourneys,
          averageDistanceOfReturnJourneys: data.averageDistanceOfReturnJourneys,
          top5DepartureStations: data.top5DepartureStations,
          top5ReturnStations: data.top5ReturnStations,
        };
        return stationDetails;
      })
    );
  }
 
    // Fetches station data by their IDs
    getSingleStations(ids: string[]): Observable<StationAddress[]> {
      const params = new HttpParams().set('ids', ids.join(','));
      return this.http.get<StationAddress[]>(`${this.baseUrl}/StationList`, { params })
        .pipe(
          map(stations => {
            return stations.map(station => {
              return {
                id: station.id?.toString(),
                name: station.name,
                address: station.address,
              };
            });
          })
        );
    }
  
    listStations(limit: number = 100, offset: number = 0, orderBy: string = 'name', search: string = ''): Observable<Station[]> {
      const params = {
        limit: limit.toString(),
        offset: offset.toString(),
        orderBy,
        search
      };
  
      return this.http.get<Station[]>(`${this.baseUrl}/StationList/Filter`, { params });
    }
  
    getStation(stationId: number): Observable<Station> {
      return this.http.get<Station>(`${this.baseUrl}/${stationId}`);
    }
    fetchStation(stationId: number): Observable<Station> {
      return this.http.get<Station>(`${this.baseUrl}/Station/${stationId}`);
    }
  //Create-station
  createStation(station: Station): Observable<Station> {
    const endpointUrl = `${this.baseUrl}/Station/Create`;
    return this.http.post<Station>(endpointUrl, station);
  }
  //Delete-station
  deleteStation(stationId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/station/${stationId}`);
  }
  updateStation(stationId: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/station/${stationId}`, data);
  }
  //Import-Journey and station
  importData(formData: FormData, endpoint: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/Import/${endpoint}`, formData);
  }
// Journey-Departure
getDepartureStations(): Observable<Station[]> {
  return this.http.get<Station[]>(`${this.baseUrl}/stations`);
}
startJourney(departureStationId: number, departureDateTime: Date,userId:number): Observable<Journey> {
  const body = {
    departureStationId,
    departureDateTime,
    userId
  };
  return this.http.post<Journey>(`${this.baseUrl}/JourneyList/Add`, body);
}
//Check Return
getUserJourneys(userId: number): Observable<UserJourneys> {
  return this.http.get<UserJourneys>(`${this.baseUrl}/JourneyList/${userId}/User`);
}
//return 
returnJourney(returnStationId: number, returnDateTime: Date, journeyId:number) {
  const data = {
    returnStationId: returnStationId,
    returnDateTime: returnDateTime.toISOString(),
  };
  return this.http.put(`${this.baseUrl}/JourneyList/${journeyId}/return`, data);
}

//Trip or Journeys history per user
getJourneysByLoginId(loginId: number): Observable<Journey[]> {
  const url = `${this.baseUrl}/JourneyList/${loginId}/User`;
  return this.http.get<Journey[]>(url);
}
}
