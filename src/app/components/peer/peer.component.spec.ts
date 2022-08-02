import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'

import { PeerComponent } from './peer.component'

describe('PeerComponent', () => {
  let component: PeerComponent
  let fixture: ComponentFixture<PeerComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PeerComponent],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
    }).compileComponents()

    fixture = TestBed.createComponent(PeerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
