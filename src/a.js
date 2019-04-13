

p = 1;

//birthday paradox
for (let i = 0; i < 30; i++) {
  p *= 1.0 * (365 - i) / 365
}

console.log(p);