import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core'
import SwiperCore, { Pagination } from 'swiper'
import { SwiperComponent } from 'swiper/angular'

@Component({
  selector: 'app-tour',
  templateUrl: './tour.page.html',
  styleUrls: ['./tour.page.scss'],
})
export class TourPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent
  hideSkip = false

  constructor(private changeDetectionRef: ChangeDetectorRef) {}

  ngOnInit() {
    SwiperCore.use([Pagination])
  }

  onSlideChange = () => {
    this.hideSkip = this.swiper.swiperRef.realIndex >= 2
    this.changeDetectionRef.detectChanges()
  }

  skip = () => {
    this.swiper.swiperRef.slideTo(this.swiper.swiperRef.slides.length)
  }
}
