import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceOrder } from '../../features/service-orders/service-orders';

@Injectable({ providedIn: 'root' })
export class ServiceOrdersService {
  private http = inject(HttpClient);

  getOrders(): Observable<ServiceOrder[]> {
    return this.http
      .get<{ orders: ServiceOrder[] }>('/assets/mock/service-orders.json')
      .pipe(map(res => res.orders));
  }
}
