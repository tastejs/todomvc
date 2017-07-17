namespace $ { export class $mol_app_todomvc extends $mol_scroll {

	/// title @ \Todos
	title() {
		return $mol_locale.text( this.locale_contexts() , "title" )
	}

	/// Title $mol_view 
	/// 	minimal_height 142 
	/// 	sub / <= title
	@ $mol_mem()
	Title() {
		return $mol_view.make({
			minimal_height : () => 142 ,
			sub : () => [].concat( this.title() ) ,
		})
	}

	/// head_complete_enabled false
	head_complete_enabled() {
		return false
	}

	/// completed_all?val false
	@ $mol_mem()
	completed_all( val? : any , force? : $mol_atom_force ) {
		return ( val !== void 0 ) ? val : false
	}

	/// Head_complete $mol_check 
	/// 	enabled <= head_complete_enabled 
	/// 	checked?val <=> completed_all?val 
	/// 	title \❯
	@ $mol_mem()
	Head_complete() {
		return $mol_check.make({
			enabled : () => this.head_complete_enabled() ,
			checked : ( val? : any ) => this.completed_all( val ) ,
			title : () => "❯" ,
		})
	}

	/// task_title_new?val \
	@ $mol_mem()
	task_title_new( val? : any , force? : $mol_atom_force ) {
		return ( val !== void 0 ) ? val : ""
	}

	/// event_add?event null
	@ $mol_mem()
	event_add( event? : any , force? : $mol_atom_force ) {
		return ( event !== void 0 ) ? event : <any> null
	}

	/// Add $mol_app_todomvc_add 
	/// 	value?val <=> task_title_new?val 
	/// 	event_done?event <=> event_add?event
	@ $mol_mem()
	Add() {
		return $mol_app_todomvc_add.make({
			value : ( val? : any ) => this.task_title_new( val ) ,
			event_done : ( event? : any ) => this.event_add( event ) ,
		})
	}

	/// Head_content / 
	/// 	<= Head_complete 
	/// 	<= Add
	Head_content() {
		return [].concat( this.Head_complete() , this.Add() )
	}

	/// Head $mol_view 
	/// 	minimal_height 64 
	/// 	sub <= Head_content
	@ $mol_mem()
	Head() {
		return $mol_view.make({
			minimal_height : () => 64 ,
			sub : () => this.Head_content() ,
		})
	}

	/// task_rows /
	task_rows() {
		return [] as any[]
	}

	/// List $mol_list rows <= task_rows
	@ $mol_mem()
	List() {
		return $mol_list.make({
			rows : () => this.task_rows() ,
		})
	}

	/// pending_message @ \0 items left
	pending_message() {
		return $mol_locale.text( this.locale_contexts() , "pending_message" )
	}

	/// Pending $mol_view sub / <= pending_message
	@ $mol_mem()
	Pending() {
		return $mol_view.make({
			sub : () => [].concat( this.pending_message() ) ,
		})
	}

	/// filter_all_label @ \All
	filter_all_label() {
		return $mol_locale.text( this.locale_contexts() , "filter_all_label" )
	}

	/// Filter_all $mol_link 
	/// 	sub / <= filter_all_label 
	/// 	arg * completed null
	@ $mol_mem()
	Filter_all() {
		return $mol_link.make({
			sub : () => [].concat( this.filter_all_label() ) ,
			arg : () => ({
			"completed" :  <any> null ,
		}) ,
		})
	}

	/// filter_active_label @ \Active
	filter_active_label() {
		return $mol_locale.text( this.locale_contexts() , "filter_active_label" )
	}

	/// Filter_active $mol_link 
	/// 	sub / <= filter_active_label 
	/// 	arg * completed \false
	@ $mol_mem()
	Filter_active() {
		return $mol_link.make({
			sub : () => [].concat( this.filter_active_label() ) ,
			arg : () => ({
			"completed" :  "false" ,
		}) ,
		})
	}

	/// filter_completed_label @ \Completed
	filter_completed_label() {
		return $mol_locale.text( this.locale_contexts() , "filter_completed_label" )
	}

	/// Filter_completed $mol_link 
	/// 	sub / <= filter_completed_label 
	/// 	arg * completed \true
	@ $mol_mem()
	Filter_completed() {
		return $mol_link.make({
			sub : () => [].concat( this.filter_completed_label() ) ,
			arg : () => ({
			"completed" :  "true" ,
		}) ,
		})
	}

	/// filterOptions / 
	/// 	<= Filter_all 
	/// 	<= Filter_active 
	/// 	<= Filter_completed
	filterOptions() {
		return [].concat( this.Filter_all() , this.Filter_active() , this.Filter_completed() )
	}

	/// Filter $mol_bar sub <= filterOptions
	@ $mol_mem()
	Filter() {
		return $mol_bar.make({
			sub : () => this.filterOptions() ,
		})
	}

	/// sweep_enabled true
	sweep_enabled() {
		return true
	}

	/// event_sweep?event null
	@ $mol_mem()
	event_sweep( event? : any , force? : $mol_atom_force ) {
		return ( event !== void 0 ) ? event : <any> null
	}

	/// sweep_label @ \Clear completed
	sweep_label() {
		return $mol_locale.text( this.locale_contexts() , "sweep_label" )
	}

	/// Sweep $mol_button_minor 
	/// 	enabled <= sweep_enabled 
	/// 	event_click?event <=> event_sweep?event 
	/// 	sub / <= sweep_label
	@ $mol_mem()
	Sweep() {
		return $mol_button_minor.make({
			enabled : () => this.sweep_enabled() ,
			event_click : ( event? : any ) => this.event_sweep( event ) ,
			sub : () => [].concat( this.sweep_label() ) ,
		})
	}

	/// foot_content / 
	/// 	<= Pending 
	/// 	<= Filter 
	/// 	<= Sweep
	foot_content() {
		return [].concat( this.Pending() , this.Filter() , this.Sweep() )
	}

	/// Foot $mol_view sub <= foot_content
	@ $mol_mem()
	Foot() {
		return $mol_view.make({
			sub : () => this.foot_content() ,
		})
	}

	/// panels / 
	/// 	<= Head 
	/// 	<= List 
	/// 	<= Foot
	panels() {
		return [].concat( this.Head() , this.List() , this.Foot() )
	}

	/// Panel $mol_list rows <= panels
	@ $mol_mem()
	Panel() {
		return $mol_list.make({
			rows : () => this.panels() ,
		})
	}

	/// Page $mol_list rows / 
	/// 	<= Title 
	/// 	<= Panel
	@ $mol_mem()
	Page() {
		return $mol_list.make({
			rows : () => [].concat( this.Title() , this.Panel() ) ,
		})
	}

	/// sub / <= Page
	sub() {
		return [].concat( this.Page() )
	}

	/// task_completed!id?val false
	@ $mol_mem_key()
	task_completed( id : any , val? : any , force? : $mol_atom_force ) {
		return ( val !== void 0 ) ? val : false
	}

	/// task_title!id?val \
	@ $mol_mem_key()
	task_title( id : any , val? : any , force? : $mol_atom_force ) {
		return ( val !== void 0 ) ? val : ""
	}

	/// event_task_drop!id?event null
	@ $mol_mem_key()
	event_task_drop( id : any , event? : any , force? : $mol_atom_force ) {
		return ( event !== void 0 ) ? event : <any> null
	}

	/// Task_row!id $mol_app_todomvc_task_row 
	/// 	completed?val <=> task_completed!id?val 
	/// 	title?val <=> task_title!id?val 
	/// 	event_drop?event <=> event_task_drop!id?event
	@ $mol_mem_key()
	Task_row( id : any ) {
		return $mol_app_todomvc_task_row.make({
			completed : ( val? : any ) => this.task_completed(id , val ) ,
			title : ( val? : any ) => this.task_title(id , val ) ,
			event_drop : ( event? : any ) => this.event_task_drop(id , event ) ,
		})
	}

} }

namespace $ { export class $mol_app_todomvc_add extends $mol_string {

	/// hint @ \What needs to be done?
	hint() {
		return $mol_locale.text( this.locale_contexts() , "hint" )
	}

	/// event_press?event null
	@ $mol_mem()
	event_press( event? : any , force? : $mol_atom_force ) {
		return ( event !== void 0 ) ? event : <any> null
	}

	/// event * 
	/// 	^ 
	/// 	keyup?event <=> event_press?event
	event() {
		return ({
			...super.event() ,
			"keyup" :  ( event? : any )=>  this.event_press( event ) ,
		})
	}

	/// event_done?event null
	@ $mol_mem()
	event_done( event? : any , force? : $mol_atom_force ) {
		return ( event !== void 0 ) ? event : <any> null
	}

} }

namespace $ { export class $mol_app_todomvc_task_row extends $mol_view {

	/// minimal_height 64
	minimal_height() {
		return 64
	}

	/// completed?val false
	@ $mol_mem()
	completed( val? : any , force? : $mol_atom_force ) {
		return ( val !== void 0 ) ? val : false
	}

	/// Complete $mol_check checked?val <=> completed?val
	@ $mol_mem()
	Complete() {
		return $mol_check.make({
			checked : ( val? : any ) => this.completed( val ) ,
		})
	}

	/// title_hint @ \Task title
	title_hint() {
		return $mol_locale.text( this.locale_contexts() , "title_hint" )
	}

	/// title?val \
	@ $mol_mem()
	title( val? : any , force? : $mol_atom_force ) {
		return ( val !== void 0 ) ? val : ""
	}

	/// Title $mol_string 
	/// 	hint <= title_hint 
	/// 	value?val <=> title?val
	@ $mol_mem()
	Title() {
		return $mol_string.make({
			hint : () => this.title_hint() ,
			value : ( val? : any ) => this.title( val ) ,
		})
	}

	/// event_drop?event null
	@ $mol_mem()
	event_drop( event? : any , force? : $mol_atom_force ) {
		return ( event !== void 0 ) ? event : <any> null
	}

	/// Drop $mol_button 
	/// 	sub / \✖
	/// 	event_click?event <=> event_drop?event
	@ $mol_mem()
	Drop() {
		return $mol_button.make({
			sub : () => [].concat( "✖" ) ,
			event_click : ( event? : any ) => this.event_drop( event ) ,
		})
	}

	/// sub / 
	/// 	<= Complete 
	/// 	<= Title 
	/// 	<= Drop
	sub() {
		return [].concat( this.Complete() , this.Title() , this.Drop() )
	}

	/// attr * 
	/// 	^ 
	/// 	mol_app_todomvc_task_row_completed <= completed?val
	attr() {
		return ({
			...super.attr() ,
			"mol_app_todomvc_task_row_completed" :  this.completed() ,
		})
	}

} }

