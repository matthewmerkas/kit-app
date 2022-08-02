import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { PeerPageRoutingModule } from './peer-routing.module'

import { PeerPage } from './peer.page'

describe('PeerPage', () => {
  let component: PeerPage
  let fixture: ComponentFixture<PeerPage>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PeerPage],
      imports: [
        IonicModule.forRoot(),
        PeerPageRoutingModule,
        RouterModule.forRoot([]),
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(PeerPage)
    component = fixture.componentInstance
    fixture.detectChanges()
  }))

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
