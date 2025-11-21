// 각 시간표(Time Block)에 고유 ID를 부여하고, 필요한 조교 수를 정의
export const timeblocks = [
    //월
    { id: 'MON1', day: '월', startTime: '17:00', endTime: '19:00', teacher: 'A', requiredTAs: 1 },
    { id: 'MON2', day: '월', startTime: '17:00', endTime: '19:00', teacher: 'B', requiredTAs: 1 },
    { id: 'MON3', day: '월', startTime: '17:00', endTime: '19:00', teacher: 'C', requiredTAs: 1 },
    { id: 'MON4', day: '월', startTime: '19:00', endTime: '21:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'MON5', day: '월', startTime: '19:00', endTime: '21:00', teacher: 'C', requiredTAs: 1 },
    { id: 'MON6', day: '월', startTime: '19:00', endTime: '22:00', teacher: 'A', requiredTAs: 1 },
    { id: 'MON7', day: '월', startTime: '19:00', endTime: '22:00', teacher: 'B', requiredTAs: 1 },

    //화
    { id: 'TUE1', day: '화', startTime: '17:00', endTime: '19:00', teacher: 'A', requiredTAs: 1 },
    { id: 'TUE2', day: '화', startTime: '17:00', endTime: '19:00', teacher: 'B', requiredTAs: 1 },
    { id: 'TUE3', day: '화', startTime: '17:00', endTime: '19:00', teacher: 'C', requiredTAs: 1 },
    { id: 'TUE4', day: '화', startTime: '19:00', endTime: '21:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'TUE5', day: '화', startTime: '19:00', endTime: '21:00', teacher: 'C', requiredTAs: 1 },
    { id: 'TUE6', day: '화', startTime: '19:00', endTime: '22:00', teacher: 'A', requiredTAs: 1 },
    { id: 'TUE7', day: '화', startTime: '19:00', endTime: '22:00', teacher: 'B', requiredTAs: 1 },

    //수
    { id: 'WED1', day: '수', startTime: '17:00', endTime: '19:00', teacher: 'A', requiredTAs: 1 },
    { id: 'WED2', day: '수', startTime: '17:00', endTime: '19:00', teacher: 'B', requiredTAs: 1 },
    { id: 'WED3', day: '수', startTime: '17:00', endTime: '19:00', teacher: 'C', requiredTAs: 1 },
    { id: 'WED4', day: '수', startTime: '19:00', endTime: '21:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'WED5', day: '수', startTime: '19:00', endTime: '21:00', teacher: 'C', requiredTAs: 1 },
    { id: 'WED6', day: '수', startTime: '19:00', endTime: '22:00', teacher: 'A', requiredTAs: 1 },
    { id: 'WED7', day: '수', startTime: '19:00', endTime: '22:00', teacher: 'B', requiredTAs: 1 },

    //목
    { id: 'THU1', day: '목', startTime: '17:00', endTime: '19:00', teacher: 'A', requiredTAs: 1 },
    { id: 'THU2', day: '목', startTime: '17:00', endTime: '19:00', teacher: 'B', requiredTAs: 1 },
    { id: 'THU3', day: '목', startTime: '17:00', endTime: '19:00', teacher: 'C', requiredTAs: 1 },
    { id: 'THU4', day: '목', startTime: '19:00', endTime: '21:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'THU5', day: '목', startTime: '19:00', endTime: '21:00', teacher: 'C', requiredTAs: 1 },
    { id: 'THU6', day: '목', startTime: '19:00', endTime: '22:00', teacher: 'A', requiredTAs: 1 },
    { id: 'THU7', day: '목', startTime: '19:00', endTime: '22:00', teacher: 'B', requiredTAs: 1 },

    //금
    { id: 'FRI1', day: '금', startTime: '17:00', endTime: '19:00', teacher: 'A', requiredTAs: 1 },
    { id: 'FRI2', day: '금', startTime: '17:00', endTime: '19:00', teacher: 'B', requiredTAs: 1 },
    { id: 'FRI3', day: '금', startTime: '17:00', endTime: '19:00', teacher: 'C', requiredTAs: 1 },
    { id: 'FRI4', day: '금', startTime: '19:00', endTime: '21:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'FRI5', day: '금', startTime: '19:00', endTime: '21:00', teacher: 'C', requiredTAs: 1 },
    { id: 'FRI6', day: '금', startTime: '19:00', endTime: '22:00', teacher: 'A', requiredTAs: 1 },
    { id: 'FRI7', day: '금', startTime: '19:00', endTime: '22:00', teacher: 'B', requiredTAs: 1 },

    //토
    { id: 'SAT1', day: '토', startTime: '10:00', endTime: '12:00', teacher: 'B', requiredTAs: 1 },
    { id: 'SAT2', day: '토', startTime: '10:00', endTime: '13:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SAT3', day: '토', startTime: '10:00', endTime: '13:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SAT4', day: '토', startTime: '12:00', endTime: '14:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'SAT5', day: '토', startTime: '12:00', endTime: '15:00', teacher: 'B', requiredTAs: 1 },
    { id: 'SAT6', day: '토', startTime: '16:00', endTime: '19:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SAT7', day: '토', startTime: '19:00', endTime: '22:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SAT8', day: '토', startTime: '13:00', endTime: '16:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SAT9', day: '토', startTime: '13:00', endTime: '16:00', teacher: 'A', requiredTAs: 1 },

    //일
    { id: 'SUN1', day: '일', startTime: '10:00', endTime: '13:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SUN2', day: '일', startTime: '10:00', endTime: '13:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SUN3', day: '일', startTime: '10:00', endTime: '13:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SUN4', day: '일', startTime: '13:00', endTime: '16:00', teacher: 'A', requiredTAs: 1 },
    { id: 'SUN5', day: '일', startTime: '13:00', endTime: '16:00', teacher: 'A', requiredTAs: 1 },


    // (월-금 17:00-18:00 자기화)
    { id: 'MON_SELF1', day: '월', startTime: '17:00', endTime: '18:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'TUE_SELF1', day: '화', startTime: '17:00', endTime: '18:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'WED_SELF1', day: '수', startTime: '17:00', endTime: '18:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'THU_SELF1', day: '목', startTime: '17:00', endTime: '18:00', teacher: '자기화', requiredTAs: 1 },
    { id: 'FRI_SELF1', day: '금', startTime: '17:00', endTime: '18:00', teacher: '자기화', requiredTAs: 1 },

];