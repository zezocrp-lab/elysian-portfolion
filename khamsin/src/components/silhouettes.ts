/**
 * Garment silhouettes, drawn on an 800 x 1000 stage.
 *
 * The brand ships without photography, so product "shots" are flat-lay
 * illustrations: a filled garment in the selected colourway, standing on a
 * neutral ground. Everything is a plain path so it scales, tints and
 * cross-fades for free.
 */

export type Silhouette =
  | "shirt"
  | "overshirt"
  | "coat"
  | "trousers"
  | "knit"
  | "tee"
  | "tank"
  | "scarf"
  | "cap";

export type SilhouetteArt = {
  /** Tight bounding box [x0, y0, x1, y1] — Media fits this to the frame. */
  box: [number, number, number, number];
  /** Outline of the garment — filled with the colourway. */
  body: string;
  /** Seams, hems, plackets. Stroked, never filled. */
  seams: string[];
  /** Pockets and other closed panels. Stroked, faintly filled. */
  panels?: string[];
  /** Button positions along the placket. */
  buttons?: Array<[number, number]>;
};

export const SILHOUETTES: Record<Silhouette, SilhouetteArt> = {
  shirt: {
    box: [176, 252, 624, 788],
    body: "M 400 252 C 372 252 352 259 338 270 L 296 284 L 206 326 L 176 556 L 252 578 L 292 404 L 292 788 L 508 788 L 508 404 L 548 578 L 624 556 L 594 326 L 504 284 L 462 270 C 448 259 428 252 400 252 Z",
    seams: [
      "M 338 270 L 330 302 L 400 340 L 470 302 L 462 270",
      "M 400 340 L 400 788",
      "M 186 502 L 258 524",
      "M 542 524 L 614 502",
      "M 292 404 L 336 392",
      "M 508 404 L 464 392",
    ],
    panels: ["M 318 404 L 382 404 L 382 472 L 318 472 Z"],
    buttons: [
      [400, 392],
      [400, 462],
      [400, 532],
      [400, 602],
      [400, 672],
      [400, 742],
    ],
  },

  overshirt: {
    box: [158, 248, 642, 800],
    body: "M 400 248 C 368 248 344 256 328 268 L 286 282 L 190 328 L 158 570 L 240 594 L 282 408 L 276 800 L 524 800 L 518 408 L 560 594 L 642 570 L 610 328 L 514 282 L 472 268 C 456 256 432 248 400 248 Z",
    seams: [
      "M 328 268 L 314 308 L 400 356 L 486 308 L 472 268",
      "M 400 356 L 400 800",
      "M 168 514 L 246 540",
      "M 554 540 L 632 514",
    ],
    panels: [
      "M 300 476 L 372 476 L 372 562 L 300 562 Z",
      "M 428 476 L 500 476 L 500 562 L 428 562 Z",
    ],
    buttons: [
      [400, 406],
      [400, 486],
      [400, 566],
      [400, 646],
      [400, 726],
    ],
  },

  coat: {
    box: [150, 244, 650, 836],
    body: "M 400 244 C 366 244 342 253 326 266 L 282 280 L 184 330 L 150 590 L 236 616 L 280 412 L 262 836 L 538 836 L 520 412 L 564 616 L 650 590 L 616 330 L 518 280 L 474 266 C 458 253 434 244 400 244 Z",
    seams: [
      "M 326 266 L 304 322 L 400 376 L 496 322 L 474 266",
      "M 400 376 L 400 836",
      "M 160 530 L 242 558",
      "M 558 558 L 640 530",
      "M 280 412 L 322 400",
      "M 520 412 L 478 400",
    ],
    panels: [
      "M 290 546 L 366 546 L 366 640 L 290 640 Z",
      "M 434 546 L 510 546 L 510 640 L 434 640 Z",
      "M 322 414 L 380 414 L 380 476 L 322 476 Z",
    ],
    buttons: [
      [400, 424],
      [400, 512],
      [400, 600],
      [400, 688],
      [400, 776],
    ],
  },

  trousers: {
    box: [272, 300, 528, 800],
    body: "M 292 300 L 508 300 L 528 800 L 434 800 L 400 502 L 366 800 L 272 800 Z",
    seams: [
      "M 292 350 L 508 350",
      "M 400 350 L 400 424",
      "M 340 362 L 328 794",
      "M 460 362 L 472 794",
      "M 292 372 L 336 400",
      "M 508 372 L 464 400",
    ],
  },

  knit: {
    box: [168, 262, 632, 762],
    body: "M 400 262 C 368 262 346 270 334 282 L 296 294 L 200 342 L 168 528 L 248 558 L 290 424 L 290 762 L 510 762 L 510 424 L 552 558 L 632 528 L 600 342 L 504 294 L 466 282 C 454 270 432 262 400 262 Z",
    seams: [
      "M 334 282 C 362 312 438 312 466 282",
      "M 344 300 C 368 326 432 326 456 300",
      "M 290 714 L 510 714",
      "M 178 486 L 258 516",
      "M 542 516 L 622 486",
    ],
  },

  tee: {
    box: [214, 268, 586, 760],
    body: "M 400 268 C 370 268 350 275 338 287 L 300 298 L 214 344 L 244 486 L 300 468 L 300 760 L 500 760 L 500 468 L 556 486 L 586 344 L 500 298 L 462 287 C 450 275 430 268 400 268 Z",
    seams: [
      "M 338 287 C 362 313 438 313 462 287",
      "M 348 304 C 368 324 432 324 452 304",
      "M 236 462 L 300 444",
      "M 500 444 L 564 462",
      "M 300 722 L 500 722",
    ],
  },

  tank: {
    box: [292, 274, 508, 760],
    body: "M 348 274 L 316 300 L 292 470 L 292 760 L 508 760 L 508 470 L 484 300 L 452 274 C 440 318 360 318 348 274 Z",
    seams: [
      "M 348 274 C 360 318 440 318 452 274",
      "M 292 470 L 508 470",
      "M 292 726 L 508 726",
    ],
  },

  scarf: {
    box: [250, 230, 480, 762],
    body: "M 250 230 C 330 360 268 500 336 640 L 480 700 C 412 558 474 420 398 282 Z",
    seams: [
      "M 300 250 C 372 380 314 512 378 648",
      "M 348 268 C 418 396 362 524 424 664",
      "M 344 646 L 328 706",
      "M 376 660 L 362 722",
      "M 408 674 L 396 736",
      "M 440 688 L 430 750",
      "M 470 700 L 462 762",
    ],
  },

  cap: {
    box: [236, 376, 660, 612],
    body: "M 236 566 C 236 376 564 376 564 566 Z",
    seams: [
      "M 400 384 L 400 566",
      "M 306 424 C 344 474 344 522 340 566",
      "M 494 424 C 456 474 456 522 460 566",
    ],
    panels: [
      "M 240 560 C 340 606 560 600 640 540 C 660 522 644 494 618 506 C 538 542 340 542 246 520 Z",
    ],
  },
};
