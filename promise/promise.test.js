const DronPromise = require("./promise");
const t = setTimeout;
describe("Dron promise: ", () => {
  let promise;
  let executorSpy;

  const successRes = 42;
  const errorResult = 13;

  beforeEach(() => {
    executorSpy = jest.fn(r => t(() => r(successRes), 150));

    promise = new DronPromise(executorSpy);
  })

  test("should exists and to be function", () => {
    expect(DronPromise).toBeDefined();
    expect(typeof DronPromise).toBe("function");
  });

  test("instance should have methods: then, catch, finally", () => {
    expect(promise.then).toBeDefined();
    expect(promise.catch).toBeDefined();
    expect(promise.finally).not.toBeUndefined();
  });

  test("should call executor", () => {
    expect(executorSpy).toHaveBeenCalled();
  });

  test("should get data from then block and chain them", async() => {
    const result = await promise.then(num => num).then(num => num*2);

    expect(result).toBe(successRes * 2);
  });

  test("should catch error", () => {
    const errorExecuter = (_, r) => t(() => r(errorResult), 150);
    const errorPromise = new DronPromise(errorExecuter);

    return new Promise(resolve => {
      errorPromise.catch(error => expect(error).toBe(errorResult));
      resolve();
    })
  });

  test("should call finally method", async() => {
    const finallySpy = jest.fn(() => {});
    await promise.finally(finallySpy);

    expect(finallySpy).toHaveBeenCalled();
  })

});
