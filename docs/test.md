# Test
simple app will auto create template of CRUD test case and you can modify it to complete the test case.

The simplest standalone resource step (no foreignkey) workflow of prepare test as below:
1. Add sample data in `stubs` at `backend/test/yourResource/stub`
2. modify sample's `_id` according `backend/test/yourResource/yourResource.e2e-spec.ts`
3. modify `yourResource.e2e-spec.ts` according your need such as autocomplete search text or add more test



## Prepare Simple Test
1. Start backend and frontend server, access your `category` page 
2. Try add new record, fill in sample data and save it. 
3. Obtain the sample json data from debug data component.
4. Put content into stub:
    a. edit `backend/test/category/stub/id1.create.ts`
    b. replace json content with copied record but remain `id:"00000000-0000-0000-0000-000000000001"` unchange
5. repeat sample step `backend/test/category/stub/id1.update.ts`, but you may change the data slightly like change `categoryName` from "Category 1" to "Category 1-updated"
6. Go back to frontend, add new record and fill in sample data which not pass the input validation (safe failed)
7. Copy the data into stub
    a. edit `backend/test/category/stub/id2.create.ts`
    b. replace json content with copied record but remain `id:"00000000-0000-0000-0000-000000000002"` unchange
8. After added 3 sample data into stub, you may modify `backend/test/category/category.e2e-spec.ts`:
    a. change `existAutoCompleteKeyword` to match partial of your sample data. Example your value `categoryName` is `Category 1`, you can define as `existAutoCompleteKeyword='Cat'`(It only search `categoryCode` and `CategoryName`)
    b. you can add more sample/test by refer example in this file
9. You may remove all others folder in `backend/test/documents/*` and remain only `category` so we can have success test
10. execute test by run command  `npm run test:e2e` in your backend


## Prepare Test For Data with Dependency
Every test shall implement independently, in the case of `product` which depends on category records, we can:
1. copy/modify partial of record from `backend/test/category/category.e2e-spec.ts` into `backend/test/product/product.e2e-spec.ts`
2. execute insert `category` using `beforeAll`, you may refer: 
    a. [nestjs test documentation](https://docs.nestjs.com/fundamentals/testing)
    b. [jest test order](https://jestjs.io/docs/setup-teardown#order-of-execution)




## Test guide line
1. Test shall implement in empty database cause we don't want primary key crash
2. put sample data in stub cause we don't want our code accidentally modify the sample data
3. default test is simplest approach, every additional api require additional test
4. every test shall:
    a. test http status
    b. when data effect database, shall continue verify result using subsequent step `then`