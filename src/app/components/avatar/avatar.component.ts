import { Component, Input, OnInit } from '@angular/core'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  @Input() dataUrl: string
  @Input() fileName: string
  @Input() margin: string
  @Input() name = 'person-circle'
  @Input() size: number

  iconMargin
  iconSize

  constructor() {}

  ngOnInit() {
    this.iconSize = this.size * 1.21875
    this.iconMargin = (this.size - this.iconSize) * 0.5
  }

  getUrl() {
    return (
      this.dataUrl ||
      environment.apiUrl.replace('/api', '/public/avatars/') + this.fileName
    )
  }
}
