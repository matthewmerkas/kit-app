import {
  animate,
  keyframes,
  sequence,
  style,
  transition,
  trigger,
} from '@angular/animations'

export const animations = (duration = '150ms', delay = '0ms'): any[] => [
  trigger('fade', [
    transition(
      ':enter',
      sequence([
        style({ opacity: 0 }),
        animate(delay, style({ opacity: 0 })),
        animate(duration, style({ opacity: 1 })),
      ])
    ),
    transition(
      ':leave',
      animate(
        `${duration} ease-out`,
        keyframes([style({ opacity: 1 }), style({ opacity: 0 })])
      )
    ),
  ]),
  trigger('fadeIn', [
    transition(
      ':enter',
      sequence([
        style({ opacity: 0 }),
        animate(delay, style({ opacity: 0 })),
        animate(duration, style({ opacity: 1 })),
      ])
    ),
  ]),
  trigger('fadeOut', [
    transition(
      ':leave',
      animate(
        `${duration} ease-out`,
        keyframes([style({ opacity: 1 }), style({ opacity: 0 })])
      )
    ),
  ]),
]
