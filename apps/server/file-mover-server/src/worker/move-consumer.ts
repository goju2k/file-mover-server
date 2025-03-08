export interface MoveItem {
  fileName: string;
  userName: string;
}

interface MoveItemInternal extends MoveItem {
  seq: number;
}

export class MoveConsumer {

  interval: NodeJS.Timer;

  moveItems:MoveItemInternal[] = [];

  constructor(){

    this.interval = setInterval(this.process.bind(this), 2000);

  }

  addItem(item:MoveItem){
    this.moveItems.push({
      seq: Date.now(),
      ...item,
    });
  }

  processing = false;
  process(){
    
    if(this.processing || this.moveItems.length === 0){
      return;
    }

    this.processing = true;
    
    const item = this.moveItems.shift();

    // command processing here
    console.log('item processing... ', item);
    

    console.log('item processing end', item);

    this.processing = false;

  }

}