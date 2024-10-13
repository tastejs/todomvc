export namespace Validators {
  const Regs = {
    link: /(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$@iS/
  }
  
  export const LinkValidator = (value, component) => {
    return Regs.link.test(value);
  }
}