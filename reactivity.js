let activeEffect; //

// Создает зависимость
function watchEffect(fn){
	activeEffect = fn;
	fn();
	activeEffect = null;
}


//
class Dependency{
	constructor(){
		// Хранит уникальных подписчиков
		this.subscribers = new Set();
	}
	
	// Добавляет активность в коллекцию подписчиков
	depend(){
		if(activeEffect) this.subscribers.add(activeEffect);
	}
	
	// Вызывается при изменении реактивного состояния
	notify(){
		// Перезапускает все функции, которые зависят от состояния
		this.subscribers.forEach((subscriber) => subscriber());
	}
}


// Делает переданный в нее объект реактивным
function reactive(obj){
	// Для каждого свойства объекта создает отдельный объект Dependency
	Object.keys(obj).forEach((key) => {
		const dep = new Dependency();
		let value = obj[key];
		
		// Создадим реактивный сеттер и геттер для каждого свойства объекта
		Object.defineProperty(obj, key, {
			get(){
				// добавляем эффект в коллекцию зависимостей
				dep.depend();
				return value;
			},
			set(newValue){
				// 
				if(newValue !== value){
					value = newValue;
					dep.notify();
				}
			}
		});
	})
	// Возвращаем теперь уже реактивный объект
	return obj;
}
