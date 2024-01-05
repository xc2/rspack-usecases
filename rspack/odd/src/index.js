export const foo = {
  bar() {
    this.aaa[index].bbb.ccc = 1;
    this.aaa[index + 1].bbb.ccc = 1;

    this.aaa[0].bbb.ccc = 1;
    this.aaa.foo.bbb.ccc = 1;
  },
};

export class Foo {
  bar() {
    this.aaa[index].bbb.ccc = 1;
    this.aaa[0].bbb.ccc = 1;
  }
}

export function bar() {
  this.aaa[index].bbb.ccc = 1;
  this.aaa[0].bbb.ccc = 1;
}
