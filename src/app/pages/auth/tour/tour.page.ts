import { Component, OnInit } from '@angular/core'
import SwiperCore, { Pagination } from 'swiper'

@Component({
  selector: 'app-tour',
  templateUrl: './tour.page.html',
  styleUrls: ['./tour.page.scss'],
})
export class TourPage implements OnInit {
  constructor() {}

  ngOnInit() {
    SwiperCore.use([Pagination])
  }
}
