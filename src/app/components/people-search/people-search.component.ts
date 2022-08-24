import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { Store } from '../../stores/store'
import { FormControl } from '@angular/forms'
import { Router } from '@angular/router'
import { IonModal, Platform } from '@ionic/angular'
import { User } from '../../functions/types'

const LIMIT = 15

@Component({
  selector: 'app-people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.scss'],
})
export class PeopleSearchComponent implements OnInit {
  @ViewChild('modal', { static: false }) modal: IonModal
  @Input() trigger = 'people-search'
  @Output() userSelect = new EventEmitter<User>()

  searchForm = new FormControl('')
  users: User[] = []

  constructor(
    public platform: Platform,
    private router: Router,
    private store: Store
  ) {}

  @Input()
  onClick(user: User) {
    this.router.navigate(['/home/peer/' + user._id])
  }

  _onClick(user: User) {
    this.userSelect.emit(user)
    this.modal.dismiss()
  }

  ngOnInit() {
    this.searchForm.reset('')
    this.store.user.getList(undefined, '', LIMIT).subscribe((res) => {
      this.users = res
    })
    this.searchForm.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe((value) => {
        const filter = value
          ? {
              $or: JSON.stringify([
                { displayName: { $regex: value, $options: 'i' } },
                { username: { $regex: value, $options: 'i' } },
              ]),
            }
          : undefined
        this.store.user.getList(filter, '', LIMIT).subscribe((res) => {
          this.users = res
        })
      })
  }

  async onFocus() {
    if ((await this.modal.getCurrentBreakpoint()) < 0.9) {
      return this.modal.setCurrentBreakpoint(0.9)
    }
  }

  onWillPresent() {
    this.store.user.getList(undefined, '', LIMIT).subscribe((res) => {
      this.users = res
    })
  }
}
