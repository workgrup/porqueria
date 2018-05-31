{{#each contacts}}
	<label style="padding-left: 45px;margin-bottom: -6px;"><input type="checkbox" name="checkbox-1a" id="{{this.number}}:{{this.email}}:{{this.name}}" style="border-bottom-width: 1px;" value="{{toLowerCase this.name}}">{{this.name}}</label>
{{/each}}