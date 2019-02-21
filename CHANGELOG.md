# idb-pconnector change log

# 1.0.4
Patched require issue outlined in issue #32 (#33)

- do not delete dbstmt and dbconn from idb-connector returned require object
- rather delete properties from module.exports object

# 1.0.3
- migrate repository over to https://github.com/IBM/nodejs-idb-pconnector
- update links to point to new repository
- refactor code base to now use airbnb style guide
