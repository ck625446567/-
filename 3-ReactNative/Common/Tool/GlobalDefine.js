/**
 * Created on 11:32 2018/11/12.
 * file name GlobalDefine
 * by chenkai
 */

export function carTypeImage(carType) {
    if (carType === 'LICENSED_CAR') {
        return require('../Source/LICENSED_CAR.png');
    }
    return null;
}
