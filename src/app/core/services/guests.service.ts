import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Guest } from '../../features/guests/guests';

@Injectable({ providedIn: 'root' })
export class GuestsService {
  private http = inject(HttpClient);

  getGuests(): Observable<Guest[]> {
    return this.http
      .get<{ guests: Guest[] }>('/assets/mock/guests.json')
      .pipe(map(res => res.guests));
  }
}
