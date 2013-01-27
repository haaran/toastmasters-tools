<?php

class Initialsetup {

	/**
	 * Make changes to the database.
	 *
	 * @return void
	 */
	public function up()
	{
		// Club table
        Schema::create('clubs', function($table){
            $table->engine='InnoDB';
            $table->increments('id');

            $table->string('club_name',100)->unique();
            $table->integer('club_number')->unsigned()->unique();

            $table->string('password', 64);
            $table->integer('day_of_meeting')->unsigned();
            $table->date('creation_date');

            $table->timestamps();
        });

        Schema::create('members', function($table){
            $table->engine='InnoDB';
            $table->increments('id');

            $table->string('name', 100);
            $table->string('email_address', 365);
            $table->string('title', 50);
            $table->integer('month_of_birth')->unsigned();
            $table->timestamps();
        });

        Schema::create('club_member', function($table){
            $table->engine='InnoDB';
            $table->increments('id');
            $table->integer('club_id')->unsigned();
            $table->integer('member_id')->unsigned();
            $table->date('join_date');
            $table->date('last_attended');
            $table->date('last_speech');
            $table->text('speech_description', 20);
            $table->boolean('is_active');
            $table->timestamps();
            $table->unique(array('club_id', 'member_id'));
            $table->foreign('club_id')->references('id')->on('clubs');
            $table->foreign('member_id')->references('id')->on('members');
        });
	}

	/**
	 * Revert the changes to the database.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::drop('club_member');
		Schema::drop('members');
        Schema::drop('clubs');
	}

}