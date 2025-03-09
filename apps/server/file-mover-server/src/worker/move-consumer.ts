export interface MoveItem {
  fileName: string;
  userName: string;
}

interface MoveItemInternal extends MoveItem {
  seq: number;
  cb?: (item:MoveItemInternal)=>void;
}

export class MoveConsumer {

  interval: NodeJS.Timer;

  moveItems:MoveItemInternal[] = [];

  constructor(){

    this.interval = setInterval(this.process.bind(this), 2000);

  }

  addItem(item:MoveItem, cb?:(item:MoveItemInternal)=>void){
    this.moveItems.push({
      seq: Date.now(),
      cb,
      ...item,
    });
  }

  processing = false;
  async process(){
    
    if(this.processing || this.moveItems.length === 0){
      return;
    }
    
    const item = this.moveItems.shift();
    if(!item){
      return;
    }

    this.processing = true;

    // command processing here
    console.log('item processing... ', item);

    await new Promise((resolve)=>{
      setTimeout(()=>{
        resolve(true);
      }, 1000 + Math.random() * 2000);
    });

    console.log('item processing end', item);

    if(item.cb){
      item.cb(item);
    }

    this.processing = false;

  }

}