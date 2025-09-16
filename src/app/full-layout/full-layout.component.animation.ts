import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

  export const FlyIn = trigger('FlyIn',[
    transition('void=>*',[
      style({opacity:0,transform:'translateY(-50%)'}),
      animate('100ms')
    ]),
    transition('*=>void',[
      animate
      ('100ms',style({opacity:0,transform:'translateY(-100%)'}))
    ])
  ])

  export const FlyInside = trigger('FlyInside',[
    transition('void => *',[
      style({transform:'translateX(-100px)'}),
      animate('500ms ease-out')
    ]),
    transition('* => void',[
      style({opacity:0}),
      animate('500ms ease-in-out')
    ])
  ])


  export const SideCollapse = trigger('SideCollapse',[
    state('void',style({
      width:0,
      opacity:1
    })),
    transition('void => *',[
      animate('10ms')
    ])
  ])
  export const sideNavAnim = trigger('sideNavAnim',[
    state('collapsed',style({
      width:'72px'
    })),
    state('expanded',style({
      width:'223px'
    })),
    transition('collapsed => expanded',[
      animate('400ms ease-out')
    ]),
    transition('expanded => collapsed',[
      animate('500ms ease-in-out')
    ])
  ])
  export const marginadjust = trigger('marginadjust',[
    state('collapsed',style({
      marginLeft:'72px'
    })),
    state('expanded',style({
      marginLeft:'223px'
    })),
    transition('collapsed => expanded',[
      animate('400ms ease-out')
    ]),
    transition('expanded => collapsed',[
      animate('500ms ease-in-out')
    ])
  ])

  export const FlyfromRt = trigger('FlyfromRt',[
    transition('void => *',[
      style({transform:'translateX(100%)'}),
      animate('500ms 200ms ease-out',
      style({transform:'translateX(0)'}))
    ]),
    // transition('* => void',[
    //   style({transform:'translateX(0)'}),
    //   animate('500ms ease-in-out',
    //   style({transform:'translateX(100%)'}))
    // ])
  ])
  export const wait4Rt = trigger('wait4Rt',[
    transition('void => *',[
      style({transform:'translateX(100%)'}),
      animate('500ms ease-out',
      style({transform:'translateX(0)'}))
    ]),
    transition('* => void',[
      style({transform:'translateX(0)'}),
      animate('500ms ease-in-out',
      style({transform:'translateX(100%)'}))
    ])
  ])
  