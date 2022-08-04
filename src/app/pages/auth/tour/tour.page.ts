import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core'
import SwiperCore, { Pagination } from 'swiper'
import { SwiperComponent } from 'swiper/angular'
import { animations } from '../../../functions/animations'
import { Store } from '../../../stores/store'
import { forkJoin } from 'rxjs'
import { removeTokens } from '../../../functions/local-storage'
import { Router } from '@angular/router'

@Component({
  selector: 'app-tour',
  templateUrl: './tour.page.html',
  styleUrls: ['./tour.page.scss'],
  animations: animations(),
})
export class TourPage implements OnInit {
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent
  showSkip = true

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private router: Router,
    public store: Store
  ) {}

  ngOnInit() {
    removeTokens()
    this.store.initialise() // Clear stores
    SwiperCore.use([Pagination])
  }

  login = () => {
    forkJoin([
      this.store.message.getLatest(),
      this.store.user.getMe(),
    ]).subscribe(() => {
      this.router.navigate(['/home'])
    })
  }

  onSlideChange = () => {
    this.showSkip =
      this.swiper.swiperRef.realIndex < this.swiper.swiperRef.slides.length - 1
    this.changeDetectionRef.detectChanges()
  }

  skip = () => {
    this.swiper.swiperRef.slideTo(this.swiper.swiperRef.slides.length)
  }
}
