## [0.1.1-1](https://github.com/tkesgar/shuba/compare/v0.1.1-0...v0.1.1-1) (2020-09-26)

## [0.1.1-0](https://github.com/tkesgar/shuba/compare/v0.1.0...v0.1.1-0) (2020-09-26)

# 0.1.0 (2020-09-26)

### Code Refactoring

- split handle as separate module
  ([9d85531](https://github.com/tkesgar/shuba/commit/9d85531037a2461f78d0c790a0990ae2e5902e41))

### Features

- add API response functions and ApiError
  ([8c332cf](https://github.com/tkesgar/shuba/commit/8c332cf339a8ff8fb0fe7bb20833255f100b56e2))
- add auth
  ([aa25f2d](https://github.com/tkesgar/shuba/commit/aa25f2d0c6f6bf082c1c2d3de30a1c8cfb1994d4))
- add send function
  ([5c82078](https://github.com/tkesgar/shuba/commit/5c820780996169903602b0332c5b728c157d39e2))
- change handle fn args, handle result by type
  ([40414c0](https://github.com/tkesgar/shuba/commit/40414c033b898395660b1b8231e772846aa41a64))
- handle ApiError in handle
  ([9beaeab](https://github.com/tkesgar/shuba/commit/9beaeab486f715a1843ef57f359457aa7cc21bb3))
- initialize package, add handle
  ([48c2267](https://github.com/tkesgar/shuba/commit/48c226783e60c049a8db0670d862031674d7699c))

### BREAKING CHANGES

- use import { handle } instead of import handle
- handle is now incompatible with existing handle implementations, which put req
  and res as first and second args for the handler function.
