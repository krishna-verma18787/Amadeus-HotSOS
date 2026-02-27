import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoomAssignment } from '../../features/housekeeping/housekeeping';

@Injectable({ providedIn: 'root' })
export class HousekeepingService {
  private http = inject(HttpClient);

  getRooms(): Observable<RoomAssignment[]> {
    return this.http
      .get<{ rooms: RoomAssignment[] }>('/assets/mock/housekeeping.json')
      .pipe(map(res => res.rooms));
  }
}
