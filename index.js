const messageInput = document.getElementById("message");
const encryptedMessage = document.getElementById("encryptedMessage");
const decryptedMessage = document.getElementById("decryptedMessage");

// // finds the greatest common divisor of GCD
function gcd(a, h) {
  let temp;

  while (true) {
    temp = h % a;

    if (temp === 0n) {
      return a;
    }

    h = a;
    a = temp;
  }
}

function generateEncryptionExponent(phi) {
  let e = 2n;

  while (true) {
    // e must be co-prime to phi and less than phi.

    if (gcd(e, phi) === 1n) {
      break;
    } else e++;
  }

  return e;
}

function computeDecryptionExponent(e, phi) {
  let d = 2n;

  while (true) {
    if ((d * e) % phi === 1n) {
      break;
    }
    d += 1n;
  }

  return d;
}

function encrypt(m, publicKey) {
  const { e, n } = publicKey;

  const c = m ** e % n;

  return c;
}

function decrypt(c, secretKey) {
  const { d, n } = secretKey;

  const m = c ** d % n;

  return m;
}

// -------- Generating a pair of cryptographic keys --------

// two random prime numbers
const p = 7n; // 23
const q = 19n; // 31

const n = p * q; // multiplication of two prime numbers
const phi = (p - 1n) * (q - 1n); // totient, which represents the number of integers that are relatively prime to n in the range 1 to n
const e = generateEncryptionExponent(phi); // e (public exponent) - is the number that is used as part of the public key
const d = computeDecryptionExponent(e, phi); // d (private exponent) - (d * e) % phi = 1

const publicKey = { e, n };
const secretKey = { d, n };

console.table([
  `prime number p:`,
  p,
  `prime number q:`,
  q,
  `modulus n:`,
  n,
  `totient phi:`,
  phi,
]);
console.table(["public exponent e:", e, "private exponent d:", d]);
console.table(["PublicKey: ", publicKey, "SecretKey: ", secretKey]);

// -------- Encryption and decryption function for non numeric values --------

const encryptFn = () => {
  const inputValue = Array.from(messageInput.value);

  const encryptedArray = inputValue.map((letter) => {
    const numericValue = BigInt(letter.charCodeAt(0));

    return encrypt(numericValue, publicKey);
  });

  encryptedMessage.innerText = encryptedArray.join("-");
};

const decryptFn = () => {
  const inputValue = encryptedMessage.innerText.split("-");

  const decryptedArray = inputValue.map((number) => {
    const decryptedNumericValue = decrypt(BigInt(number), secretKey);

    return String.fromCharCode(Number(decryptedNumericValue));
  });

  decryptedMessage.innerText = decryptedArray.join("");
};

// -------- Simple encrypt and decrypt function for numbers --------

// const encryptFn = () => {
//   const inputValue = BigInt(messageInput.value);
//   const encrypted = encrypt(inputValue, publicKey);

//   encryptedMessage.innerText = encrypted;
// };

// const decryptFn = () => {
//   const inputValue = BigInt(encryptedMessage.innerText);
//   const decrypted = decrypt(inputValue, secretKey);

//   decryptedMessage.innerText = decrypted;
// };
