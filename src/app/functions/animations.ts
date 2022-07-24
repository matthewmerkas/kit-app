import {
  animate,
  keyframes,
  sequence,
  style,
  transition,
  trigger,
} from '@angular/animations'

export const animations = (duration = '150ms', delay = '0ms'): any[] => [
  trigger(`fade-${duration}-${delay}`, [
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
  trigger(`fadeIn-${duration}-${delay}`, [
    transition(
      ':enter',
      sequence([
        style({ opacity: 0 }),
        animate(delay, style({ opacity: 0 })),
        animate(duration, style({ opacity: 1 })),
      ])
    ),
  ]),
  trigger(`fadeOut-${duration}-${delay}`, [
    transition(
      ':leave',
      animate(
        `${duration} ease-out`,
        keyframes([style({ opacity: 1 }), style({ opacity: 0 })])
      )
    ),
  ]),
]
