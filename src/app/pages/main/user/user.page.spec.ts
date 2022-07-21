import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { UserPageRoutingModule } from './user-routing.module'

import { UserPage } from './user.page'

describe('UserPage', () => {
  let component: UserPage
  let fixture: ComponentFixture<UserPage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserPage],
      imports: [
        IonicModule.forRoot(),
        UserPageRoutingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(UserPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
