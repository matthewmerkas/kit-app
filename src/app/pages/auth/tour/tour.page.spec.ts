import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'

import { TourPage } from './tour.page'

describe('TourPage', () => {
  let component: TourPage
  let fixture: ComponentFixture<TourPage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TourPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents()

    fixture = TestBed.createComponent(TourPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
