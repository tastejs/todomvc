exports = module.exports = Migration;

function Migration() {
	//
}

Migration.prototype.up = function() {
	this.models.createModel('Schema', {
		id: [this.UUID, this.CanUpdate(false)],
		version: [this.Integer],
		app: [this.String],
		checksum: [this.String],
		createdAt: [this.DateTime, this.Default('CURRENT_TIMESTAMP')]
	});
	this.models.createModel('ClockTaskResult', {
		id: [this.UUID, this.CanUpdate(false)],
		name: [this.String, this.Required],
		createdAt: [this.DateTime, this.Default('CURRENT_TIMESTAMP')]
	});
	this.models.createModel('TriggerResult', {
		id: [this.UUID, this.CanUpdate(false)],
		triggerName: [this.String, this.Required],
		createdAt: [this.DateTime, this.Default('CURRENT_TIMESTAMP')],
		subject: [this.UUIDType, this.Required]
	});
	this.models.createModel('Test', {
		id: [this.UUID, this.CanUpdate(false)],
		name: [this.String, this.Required],
		sessions: [this.HasMany(this.models.TestSession)],
		variants: [this.HasMany(this.models.TestVariant)]
	});
	this.models.createModel('TestParticipant', {
		id: [this.UUID, this.CanUpdate(false)],
		sessions: [this.HasMany(this.models.TestSession)]
	});
	this.models.createModel('TestSession', {
		id: [this.UUID, this.CanUpdate(false)],
		test: [this.BelongsTo(this.models.Test), this.Required],
		participant: [this.BelongsTo(this.models.TestParticipant)],
		variant: [this.String, this.Required],
		createdAt: [this.DateTime, this.Default('CURRENT_TIMESTAMP')]
	});
	this.models.createModel('TestVariant', {
		id: [this.UUID, this.CanUpdate(false)],
		name: [this.String, this.Required],
		numberOfParticipants: [this.Integer, this.Required],
		test: [this.BelongsTo(this.models.Test), this.Required]
	});

};

Migration.prototype.down = function() {
	this.models.destroyModel('Schema');
	this.models.destroyModel('ClockTaskResult');
	this.models.destroyModel('TriggerResult');
	this.models.destroyModel('Test');
	this.models.destroyModel('TestParticipant');
	this.models.destroyModel('TestSession');
	this.models.destroyModel('TestVariant');

};
