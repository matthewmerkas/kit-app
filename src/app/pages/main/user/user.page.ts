import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { User } from '../../../functions/types'
import { Store } from '../../../stores/store'
import { animations } from '../../../functions/animations'

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  animations: animations(),
})
export class UserPage implements OnInit {
  public user: User

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.store.user.get(id).subscribe((res) => {
      this.user = res
    })
  }
}
