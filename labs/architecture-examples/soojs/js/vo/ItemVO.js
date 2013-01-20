function ItemVO(inTitle, inId, inIsCompleted) {

	var my 				= this;

	my.title			= inTitle || null;
	my.id				= inId || null;
	my.isCompleted		= inIsCompleted || false;

}