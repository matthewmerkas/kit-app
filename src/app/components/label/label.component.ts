import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
})
export class LabelComponent {
  @Input() arrowSide: 'top' | 'bottom' = 'top'
  @Input() arrowMargin: { left?: string; right?: string }
  @Input() message: string
  @Input() messageMargin: { left?: string; right?: string }
  @Input() position: { top?: string; bottom?: string }

  constructor() {}
}
