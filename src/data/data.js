import {fromJS} from 'immutable'


const graph1 = fromJS({
    blocks:[],
    nodes: [
        {
            shape: 'circle',
            color: '#fdc689',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            posBalance: 15,
            activity: 20,
            mass: 1,
            label: 'g0',
            x: 841,
            title: '',
            y: 276,
            type: 'generator',
            id: 0
        },
        {
            shape: 'circle',
            color: '#fdc689',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            posBalance: 59,
            activity: 35,
            mass: 1,
            label: 'g1',
            x: 866,
            title: '',
            y: 380,
            type: 'generator',
            id: 1
        },
        {
            shape: 'circle',
            color: '#fdc689',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            posBalance: 71,
            activity: 95,
            mass: 1,
            label: 'g2',
            x: 890,
            title: '',
            y: 70,
            type: 'generator',
            id: 2
        },
        {
            shape: 'circle',
            color: '#6dcff6',
            supportProb: 0.2571428571428571,
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            mass: 200,
            label: 'a3',
            popularity: 27,
            x: 278,
            title: '',
            y: 488,
            type: 'author',
            id: 3
        },
        {
            shape: 'circle',
            color: '#6dcff6',
            supportProb: 0.7428571428571429,
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            mass: 200,
            label: 'a4',
            popularity: 78,
            x: 494,
            title: '',
            y: 21,
            type: 'author',
            id: 4
        },

        {
            size: 5,
            shape: 'circle',
          color: '#6dcff6',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            activity: 0.5173480703168425,
            mass: 1,
            label: 'a5',
            x: 698,
            title: '',
            y: 113,
            type: 'author',
            id: 5
        },
        {
            size: 5,
            shape: 'circle',
            color: '#6dcff6',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            activity: 0.13766072629031223,
            mass: 1,
            label: 'a6',
            x: 351,
            title: '',
            y: 85,
            type: 'author',
            id: 6
        },


        {
            size: 5,
            shape: 'circle',
          color: '#6dcff6',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            activity: 0.6940353760302038,
            mass: 1,
            label: 'a7',
            x: 555,
            title: '',
            y: 573,
            type: 'author',
            id: 7
        },
        {
            size: 5,
            shape: 'circle',
              color: '#6dcff6',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            activity: 0.16301038076309537,
            mass: 1,
            label: 'a8',
            x: 814,
            title: '',
            y: 445,
            type: 'author',
            id: 8
        },
        {
            size: 5,
            shape: 'circle',
            color: '#7cc576',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            activity: 0.7508754856004047,
            mass: 1,
            label: 's9',
            x: 815,
            title: '',
            y: 153,
            type: 'supporter',
            id: 9
        },
        {
            size: 5,
            shape: 'circle',
            color: '#7cc576',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            activity: 0.15904305325985724,
            mass: 1,
            label: 's10',
            x: 344,
            title: '',
            y: 87,
            type: 'supporter',
            id: 10
        },
        {
            size: 5,
            shape: 'circle',
            color: '#7cc576',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            activity: 0.9040664016636477,
            mass: 1,
            label: 's11',
            x: 541,
            title: '',
            y: 436,
            type: 'supporter',
            id: 11
        },
        {
            size: 5,
            shape: 'circle',
            color: '#7cc576',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            activity: 0.9040664016636477,
            mass: 1,
            label: 's12',
            x: 541,
            title: '',
            y: 436,
            type: 'supporter',
            id: 12
        },
        {
            size: 5,
            shape: 'circle',
            color: '#7cc576',
            scaling: {
                min: 2,
                max: 50,
                label: {
                    min: 2,
                    max: 40
                }
            },
            activity: 0.9040664016636477,
            mass: 1,
            label: 's13',
            x: 541,
            title: '',
            y: 436,
            type: 'supporter',
            id: 13
        }
    ],
    lastNodeId: 12,

    edges: [
        {
            id: '0_3',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 0,
            target: 3,
            width: 3,
            label: 'supports',
            age: 56
        },

        {
            id: '0_4',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 0,
            target: 4,
            width: 3,
            label: 'supports',
            age: 56
        },

        {
            id: '0_5',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 0,
            target: 5,
            width: 3,
            label: 'supports',
            age: 56
        },

        {
            id: '9_3',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 9,
            target: 3,
            width: 3,
            label: 'supports',
            age: 56
        },

        {
            id: '10_3',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 10,
            target: 3,
            width: 3,
            label: 'supports',
            age: 56
        },
        {
            id: '10_4',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 10,
            target: 4,
            width: 3,
            label: 'supports',
            age: 56
        },

        {
            id: '1_4',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 1,
            target: 4,
            width: 3,
            label: 'supports',
            age: 56
        },

        {
            id: '11_5',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 11,
            target: 5,
            width: 3,
            label: 'supports',
            age: 56
        },

        {
            id: '12_5',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 12,
            target: 5,
            width: 3,
            label: 'supports',
            age: 56
        },

        {
            id: '13_5',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 13,
            target: 5,
            width: 3,
            label: 'supports',
            age: 56
        },

        {
            id: '9_6',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 9,
            target: 6,
            width: 3,
            label: 'supports',
            age: 56
        },


        {
            id: '9_7',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 9,
            target: 7,
            width: 3,
            label: 'supports',
            age: 56
        },


        {
            id: '10_6',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 10,
            target: 6,
            width: 3,
            label: 'supports',
            age: 56
        },


        {
            id: '10_7',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 10,
            target: 7,
            width: 3,
            label: 'supports',
            age: 56
        },


        {
            id: '10_8',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 10,
            target: 8,
            width: 3,
            label: 'supports',
            age: 56
        },


        {
            id: '1_8',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 1,
            target: 8,
            width: 3,
            label: 'supports',
            age: 56
        },


        {
            id: '11_8',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 11,
            target: 8,
            width: 3,
            label: 'supports',
            age: 56
        },

                {
                    id: '2_7',
                    arrows: {
                        to: {
                            enabled: false
                        }
                    },
                    source: 2,
                    target: 7,
                    width: 3,
                    label: 'supports',
                    age: 56
                },

        {
            id: '2_8',
            arrows: {
                to: {
                    enabled: false
                }
            },
            source: 2,
            target: 8,
            width: 3,
            label: 'supports',
            age: 56
        },
    ]
})



const graph2 = fromJS({
    blocks:[],
     nodes: [
       {
         shape: 'circle',
         color: '#fdc689',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         posBalance: 15,
         activity: 20,
         mass: 1,
         label: 'g0',
         x: 841,
         title: '',
         y: 276,
         type: 'generator',
         id: 0
       },
       {
         shape: 'circle',
         color: '#fdc689',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         posBalance: 59,
         activity: 35,
         mass: 1,
         label: 'g1',
         x: 866,
         title: '',
         y: 380,
         type: 'generator',
         id: 1
       },
       {
         shape: 'circle',
         color: '#fdc689',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         posBalance: 71,
         activity: 95,
         mass: 1,
         label: 'g2',
         x: 890,
         title: '',
         y: 70,
         type: 'generator',
         id: 2
       },
       {
         shape: 'circle',
         color: '#6dcff6',
         supportProb: 0.2571428571428571,
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         mass: 200,
         label: 'a3',
         popularity: 27,
         x: 278,
         title: '',
         y: 488,
         type: 'author',
         id: 3
       },
       {
         shape: 'circle',
         color: '#6dcff6',
         supportProb: 0.7428571428571429,
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         mass: 200,
         label: 'a4',
         popularity: 78,
         x: 494,
         title: '',
         y: 21,
         type: 'author',
         id: 4
       },
       {
         size: 5,
         shape: 'circle',
         color: '#7cc576',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         activity: 0.5173480703168425,
         mass: 1,
         label: 's5',
         x: 698,
         title: '',
         y: 113,
         type: 'supporter',
         id: 5
       },
       {
         size: 5,
         shape: 'circle',
         color: '#7cc576',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         activity: 0.13766072629031223,
         mass: 1,
         label: 's6',
         x: 351,
         title: '',
         y: 85,
         type: 'supporter',
         id: 6
       },
       {
         size: 5,
         shape: 'circle',
         color: '#7cc576',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         activity: 0.6940353760302038,
         mass: 1,
         label: 's7',
         x: 555,
         title: '',
         y: 573,
         type: 'supporter',
         id: 7
       },
       {
         size: 5,
         shape: 'circle',
         color: '#7cc576',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         activity: 0.16301038076309537,
         mass: 1,
         label: 's8',
         x: 814,
         title: '',
         y: 445,
         type: 'supporter',
         id: 8
       },
       {
         size: 5,
         shape: 'circle',
         color: '#7cc576',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         activity: 0.7508754856004047,
         mass: 1,
         label: 's9',
         x: 815,
         title: '',
         y: 153,
         type: 'supporter',
         id: 9
       },
       {
         size: 5,
         shape: 'circle',
         color: '#7cc576',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         activity: 0.15904305325985724,
         mass: 1,
         label: 's10',
         x: 344,
         title: '',
         y: 87,
         type: 'supporter',
         id: 10
       },
       {
         size: 5,
         shape: 'circle',
         color: '#7cc576',
         scaling: {
           min: 2,
           max: 50,
           label: {
             min: 2,
             max: 40
           }
         },
         activity: 0.9040664016636477,
         mass: 1,
         label: 's11',
         x: 541,
         title: '',
         y: 436,
         type: 'supporter',
         id: 11
       }
     ],
     lastNodeId: 12,
     edges: [
       {
         id: '0_3',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 0,
         target: 3,
         width: 3,
         label: 'supports',
         age: 56
       },
  
       {
         id: '1_3',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 1,
         target: 3,
         width: 3,
         label: 'supports',
         age: 46
       },
       {
         id: '1_4',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 1,
         target: 4,
         width: 3,
         label: 'supports',
         age: 58
       },
       {
         id: '2_4',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 2,
         target: 4,
         width: 3,
         label: 'supports',
         age: 12
       },
       {
         id: '5_4',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 5,
         target: 4,
         width: 3,
         label: 'supports',
         age: 83
       },
       {
         id: '6_4',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 6,
         target: 4,
         width: 3,
         label: 'supports',
         age: 3
       },
       {
         id: '7_3',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 7,
         target: 3,
         width: 3,
         label: 'supports',
         age: 82
       },
       {
         id: '8_4',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 8,
         target: 4,
         width: 3,
         label: 'supports',
         age: 39
       },
       {
         id: '9_3',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 9,
         target: 3,
         width: 3,
         label: 'supports',
         age: 35
       },
       {
         id: '10_4',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 10,
         target: 4,
         width: 3,
         label: 'supports',
         age: 26
       },
       {
         id: '11_3',
         arrows: {
           to: {
             enabled: false
           }
         },
         source: 11,
         target: 3,
         width: 3,
         label: 'supports',
         age: 54
       }
     ]
  })

export {graph1, graph2}
