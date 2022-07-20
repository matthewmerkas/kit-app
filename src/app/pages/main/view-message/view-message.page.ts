import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Message } from '../../../functions/types'
import { Store } from '../../../stores/store'

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
})
export class ViewMessagePage implements OnInit {
  public message: Message

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.store.message.get(id).subscribe((res) => {
      this.message = res
    })
  }
}
