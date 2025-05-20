# Challenge Flags Reference

This file contains all the flag solutions for the web hacking challenges.
It's for developer reference only and should not be included in the deployed website.

## Base64 Encoded Flags (Used in Code)

| Challenge | Base64 Encoded Flag | Decoded Flag        |
|-----------|---------------------|---------------------|
| 1         | `SElEREVO`          | HIDDEN              |
| 2         | `U09VUkNF`          | SOURCE              |
| 3         | `UkVGTEVDVA==`      | REFLECT             |
| 4         | `RkxBRw==`          | FLAG                |
| 5         | `REVDT0RF`          | DECODE              |
| 6         | `QkVBR0xF`          | BEAGLE              |
| 7         | n/a (URL parameter) | n/a (URL parameter) |
| 8         | `QjRONE40`          | B4N4N4              |
| 9         | `Q09NTUFORA==`      | COMMAND             |
| 10        | `RklOQUxF`          | FINALE              |

## Implementation Notes

1. Challenge 7 doesn't use a traditional flag but relies on URL parameter manipulation
2. All flags in the code should use the base64 encoded version
3. Use `atob("encoded_string")` in JavaScript to decode at runtime
4. Example: `if (password === atob("UkVGTEVDVA==")) { ... }`
