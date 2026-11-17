/**
 * ICCT seasons — the single place to manage season information.
 *
 * Used by: Gallery (season tabs, photos, champions, highlights) and the
 * Home page Hall of Champions strip.
 *
 * To update a season:
 *   photos      add Cloudinary photo links (in display order). Leave empty until verified photos arrive.
 *   champion    winning team (team = church name, place = locality). Leave undefined if not verified.
 *   runnerUp    same shape as champion. Leave undefined if not verified.
 *   highlights  short verified facts, e.g. 'Final decided by a Super Over'. Leave [] if none.
 *   championsPhoto  optional photo of the winning team (Cloudinary link or '/champions/2017.jpg').
 *
 * Only add information that has been verified by the organising team.
 */

export type SeasonStatus = 'completed' | 'upcoming'

export interface TeamCredit {
  team: string
  place?: string
}

export interface SeasonInfo {
  season: number
  year: number
  edition: string
  status: SeasonStatus
  champion?: TeamCredit
  runnerUp?: TeamCredit
  championsPhoto?: string
  highlights: string[]
  photos: string[]
}

export const SEASONS: SeasonInfo[] = [
  {
    season: 1,
    year: 2017,
    edition: "ICCT '17",
    status: 'completed',
    champion: { team: 'CSI Christ Church', place: 'Trichy Road' },
    runnerUp: undefined,
    highlights: [],
    photos: [], // Season 1 photos — to be added once received
  },
  {
    season: 2,
    year: 2025,
    edition: "ICCT '25",
    status: 'completed',
    champion: { team: 'CSI All Saints Church', place: 'Pollachi' },
    runnerUp: undefined,
    highlights: [],
    photos: [
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257447/FB_IMG_1764004248243_nchaj5.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004301211_iqeh7i.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257452/FB_IMG_1764004308540_daecqo.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257453/FB_IMG_1764004331596_z3sjto.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257453/FB_IMG_1764004336507_gz1gae.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257453/FB_IMG_1764004341831_ymzl9j.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257453/FB_IMG_1764004327055_his2vj.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257452/FB_IMG_1764004314928_rkce2o.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257452/FB_IMG_1764004305889_p4zk7i.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257452/FB_IMG_1764004295841_dzgnbz.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257447/DSC07329-min_eryezp.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257447/DSC05672-min_gccrmp.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257447/DSC05673-min_cc216i.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257448/FB_IMG_1764004209103_i12pou.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004229577_isw4dd.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257448/FB_IMG_1764004253832_bahvx9.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004298138_zdich5.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257448/FB_IMG_1764004213900_h59pxc.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257448/FB_IMG_1764004257657_zsnnvk.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257449/FB_IMG_1764004216534_xjd28r.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257449/FB_IMG_1764004264240_vrjkut.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257449/FB_IMG_1764004260958_ezcb5w.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004225526_sbk2xr.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004269042_pdsy0f.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004272390_mouhft.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004276157_gjigeq.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257450/FB_IMG_1764004280397_ufphwf.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004283980_rktg28.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004236901_mgjyqa.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004293412_os7eql.jpg',
      'https://res.cloudinary.com/dplaeuuqk/image/upload/v1764257451/FB_IMG_1764004286739_vofuif.jpg',
    ],
  },
  {
    season: 3,
    year: 2026,
    edition: "ICCT '26",
    status: 'completed',
    champion: { team: 'CSI Christ Church', place: 'TVS Nagar' },
    runnerUp: undefined,
    highlights: [],
    photos: [], // Season 3 photos — to be added once received
  },
  {
    season: 4,
    year: 2027,
    edition: "ICCT '27",
    status: 'upcoming',
    highlights: [],
    photos: [],
  },
]

export const formatCredit = (c?: TeamCredit) => (c ? [c.team, c.place].filter(Boolean).join(', ') : '')
