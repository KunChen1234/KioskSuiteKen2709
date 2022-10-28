
const a = [1, 2, 3, 4, 5, 6, 7, 8]
for (let i = 0; i < a.length; i++) {
    if (a[i] > 3) {
        a.splice(i, 1);
        i--;
    }
}
console.log(a)