function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function checkForCollision(top1, right1, bottom1, left1, top2, right2, bottom2, left2) {
    return left1 <= right2 && right1 >= left2
            && top1 <= bottom2 && bottom1 >= top2;
}

function calculateAngle(x1, y1, x2, y2) {
    //define this
}