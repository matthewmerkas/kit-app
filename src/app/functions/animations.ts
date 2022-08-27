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
        animate(`${duration} ease-in`, style({ opacity: 1 })),
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
        animate(`${duration} ease-in`, style({ opacity: 1 })),
      ])
    ),
  ]),
  trigger(`fadeOut-${duration}-${delay}`, [
    transition(
      ':leave',
      sequence([
        style({ opacity: 1 }),
        animate(delay, style({ opacity: 1 })),
        animate(`${duration} ease-out`, style({ opacity: 0 })),
      ])
    ),
  ]),
]
