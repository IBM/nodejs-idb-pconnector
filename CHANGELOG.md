# idb-pconnector change log

# 1.0.8

- Allow `SQL_SUCCESS_WITH_INFO` return code to resolve the row in `fetch()` see PR [#47](https://github.com/IBM/nodejs-idb-pconnector/pull/47)

- Update deps see PR [#49](https://github.com/IBM/nodejs-idb-pconnector/pull/49)

- Patch `prepareExecute` only throw error if `value` is undefined see PR [#50](https://github.com/IBM/nodejs-idb-pconnector/pull/50)

# 1.0.7
Fix up setLibraryList example require statement see [03ce835](https://github.com/IBM/nodejs-idb-pconnector/commit/03ce835095551f660b64cac84d8f8cf8c8bc4ba9)

# 1.0.6
Add implementation of setLibraryList API see PR [#39](https://github.com/IBM/nodejs-idb-pconnector/pull/39)

# 1.0.5
Patched `prepareExecute` issue outlined in [#40](https://github.com/IBM/nodejs-idb-pconnector/issues/40)

- do not throw error when passing an object within the params array with value of null

# 1.0.4
Patched require issue outlined in issue #32 (#33)

- do not delete dbstmt and dbconn from idb-connector returned require object
- rather delete properties from module.exports object

# 1.0.3
- migrate repository over to https://github.com/IBM/nodejs-idb-pconnector
- update links to point to new repository
- refactor code base to now use airbnb style guide
