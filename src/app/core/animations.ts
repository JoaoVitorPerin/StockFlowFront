import {animate, animateChild, group, query, style, transition, trigger} from '@angular/animations';

export const animacaoPadrao = trigger('routeAnimations', [
  transition('* <=> *', [

    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      }),
    ], { optional: true }),

    query(':enter', [style({ opacity: 0 })], { optional: true }),

    query(':leave', [animate('0.3s ease-in-out', style({ opacity: 0 }))], { optional: true }),
    query(':leave', animateChild(), { optional: true }),

    query(':enter', [animate('0.3s ease-in-out', style({ opacity: 1 }))], { optional: true }),
    query(':enter', animateChild(), { optional: true }),
  ]),
]);

export const animacaoSecundaria = trigger('routeAnimations', [
  transition('1 => 2, 1 => 3, 1 => 4, 2 => 3, 2 => 4, 3 => 4', [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),

    group([
      query(':leave', [

        style({ transform: 'translateX(0%)' }),

        animate('0.4s ease-in-out', style({ transform: 'translateX(-100%)' }
        ))], { optional: true }),

      query(':enter', [

        style({ transform: 'translateX(100%)' }),

        animate('0.4s ease-in-out', style({ transform: 'translateX(0%)' }))

      ], { optional: true })
    ])
  ]),
  transition('4 => 3, 4 => 2, 4 => 1, 3 => 2, 3 => 1, 2 => 1', [
    query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),

    group([
      query(':leave', [

        style({ transform: 'translateX(0%)' }),

        animate('0.4s ease-in-out', style({ transform: 'translateX(100%)' }
        ))], { optional: true }),

      query(':enter', [

        style({ transform: 'translateX(-100%)' }),

        animate('0.4s ease-in-out', style({ transform: 'translateX(0%)' }))

      ], { optional: true })
    ])
  ]),
]);

export const inOutAnimation = trigger(
  'inOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('1s ease-out',
          style({ opacity: 1 }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('0s ease-in',
          style({ opacity: 0 }))
      ]
    )
  ]
);

export const heightAnimation = trigger('heightAnimation', [
  transition(
    ':enter',
    [
      style({ height: 0, opacity: 0 }),
      animate('.3s ease-out', style({ height: "*", opacity: 1 }))
    ]
  ),
  transition(
    ':leave',
    [
      style({ height: "*", opacity: 1 }),
      animate('.3s ease-in', style({ height: 0, opacity: 0 }))
    ]
  )
])

export const widthAnimation = trigger('widthAnimation', [
  transition(':enter', [
    style({ width: '0', opacity: 0 }),
    animate('.3s ease-out', style({ width: '16.666667%', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ width: '16.666667%', opacity: 1 }),
    animate('.3s ease-in', style({ width: '0', opacity: 0 }))
  ])
]);

export const inOutAnimationFast = trigger(
  'inOutAnimationFast',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('.3s ease-out',
          style({ opacity: 1 }))
      ]
    ),
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('.3s ease-in',
          style({ opacity: 0 }))
      ]
    )
  ]
);

export const verticalCollapseAnimation = trigger('verticalCollapseAnimation', [
  transition(':enter', [
    style({ height: 0 }), // Inicialmente oculto e com altura zero
    animate('0.3s ease-out', style({ height: '*' })) // Animação de entrada
  ]),
  transition(':leave', [
    style({ height: '*' }), // Estado inicial visível e com altura total
    animate('0.3s ease-in', style({ height: 0 })) // Animação de saída
  ])
]);