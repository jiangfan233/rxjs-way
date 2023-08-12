### 用rust + wasm 写俄罗斯方块

学习折腾了大概一周，总算有了一点成果： [code](https://github.com/jiangfan233/Old-good-days)

##### rust 生命周期

生命周期就像是"显式"的说明一个**引用**的生命周期。

目前了解到rust生命周期可分为三类：

- 1、'\_: 用完即销毁，不关心此类引用的生存周期
- 2、'static: 此类引用的生存周期 == 整个程序的生命周期
- 3、'a: 可用任意字母声明一个引用的生命周期，'b: 'a 表示b的生命周期比a长。

##### 使用trate实现给变量加上 static 生命周期

声明一个trait

```rust
pub struct PersistedOrigin;

pub trait Persist: Clone + 'static {
    fn ptr(&self) -> PersistedOrigin {
        PersistedOrigin
    }
}

```

某一类型实现该trait

```rust
impl<T: 'static> Persist for State<T> {
    fn ptr(&self) -> PersistedOrigin {
        PersistedOrigin
    }
}
```

##### 使用 rc 包裹 RefCell<T> 实现 Immutable

如果仅使用 RefCell 会报多线程错误

```rust
pub struct RefContainer<T>(pub Rc<RefCell<T>>);
```

如果需要取出 T 的值，在外部包裹一层 Option，通过take方法取得。

```rust
pub struct State<T> {
    container: RefContainer<Option<T>>,
}

impl<T> State<T> {
    pub fn value(&self) -> Ref<'_, T> {
        Ref::map(self.container.current(), |v| {
            v.as_ref().expect("Cannot get state!!!!!")
        })
    }

    pub fn set(&mut self, f: impl FnOnce(T) -> T) {
        let val = self.container.current_mut().take();
        let new_v = val.map(f);
        self.container.set_current(new_v);
    }

}

```
