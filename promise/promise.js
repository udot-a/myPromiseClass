class DronPromise {
  constructor(executor) {
    this.queue = [];
    this.errorHandler = () => {};
    this.finallyHandler = () => {};

    try {
      executor.call(null, this.onResolve, this.onReject);
    } catch(e) {
      this.errorHandler(e);
    } finally {
      this.finallyHandler();
    }
  }

  onResolve = (data) => {
    this.queue.forEach(callback => data = callback(data));
    this.finallyHandler();
  }

  onReject = (error) => {
    this.errorHandler(error);
    this.finallyHandler();
  }

  then(fn) {
    this.queue.push(fn);

    return this;
  }

  catch(fn){
    this.errorHandler = fn;

    return this;
  }

  finally(fn) {
    this.finallyHandler = fn;

    return this;
  }
}

const pause = ms => new DronPromise(
  r => setTimeout(r, ms)
);

pause(1500).then(() => console.log("Hello"))
pause(3000).then(() => console.log("Dron"))
pause(4500).then(() => console.log("Are you home"))


module.exports = DronPromise;
