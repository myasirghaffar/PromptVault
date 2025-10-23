# Supabase MCP Integration Guide

This project is configured to use Supabase Model Context Protocol (MCP) for enhanced AI assistance with your Supabase database.

## What is Supabase MCP?

Supabase MCP allows the AI assistant to:

- Query your database schema
- Browse tables and relationships
- Help write SQL queries
- Understand your data structure
- Assist with migrations and schema changes
- Provide context-aware suggestions

## Setup Instructions

### Option 1: Configure in Cursor Settings (Recommended)

1. **Open Cursor Settings:**

   - Press `Ctrl + ,` (Windows/Linux) or `Cmd + ,` (Mac)
   - Or go to `File > Preferences > Settings`

2. **Navigate to MCP Settings:**

   - Search for "MCP" in the settings search bar
   - Or go to `Features > Model Context Protocol`

3. **Add Supabase MCP Server:**

   - Click "Edit in settings.json"
   - Add the following configuration:

   ```json
   {
     "mcpServers": {
       "supabase": {
         "url": "https://mcp.supabase.com/mcp?project_ref=gzpowgtchacjztlqewbn"
       }
     }
   }
   ```

4. **Save and Restart:**
   - Save the settings file
   - Restart Cursor to activate the MCP server

### Option 2: Using Workspace Configuration

The MCP configuration is already saved in `.cursor/mcp-config.json` in this project.

To enable it:

1. Open Cursor Settings (`Ctrl/Cmd + ,`)
2. Search for "MCP"
3. Enable "Use Workspace MCP Configuration"
4. Restart Cursor

## Verifying the Integration

After setup, you can verify the integration by:

1. Opening the MCP panel in Cursor
2. Looking for "supabase" in the connected servers list
3. Asking the AI assistant database-related questions like:
   - "Show me the database schema"
   - "What tables exist in my database?"
   - "Help me write a query to get all prompts"

## Available MCP Features

With Supabase MCP, you can:

- **Schema Exploration:** View tables, columns, types, and relationships
- **Query Assistance:** Get help writing and optimizing SQL queries
- **Migration Support:** Plan and execute database migrations
- **Data Modeling:** Design and refactor your database schema
- **Security:** Review RLS (Row Level Security) policies
- **Performance:** Analyze and optimize database performance

## Project Configuration

**Project Reference:** `gzpowgtchacjztlqewbn`

**MCP URL:** `https://mcp.supabase.com/mcp?project_ref=gzpowgtchacjztlqewbn`

## Troubleshooting

### MCP Server Not Connecting

1. Verify your Supabase project is active
2. Check your internet connection
3. Ensure the project reference is correct
4. Try restarting Cursor

### Permission Issues

- Make sure your Supabase project allows API access
- Verify your project reference matches your actual Supabase project

### Need Help?

- [Supabase MCP Documentation](https://mcp.supabase.com/)
- [Cursor MCP Guide](https://docs.cursor.com/mcp)
- [Supabase Documentation](https://supabase.com/docs)

## Security Note

⚠️ The MCP URL contains your project reference. While this is safe for public use (it only provides schema information), be mindful of:

- Not sharing detailed schema information publicly if it contains sensitive business logic
- Keeping your `.env.local` file with actual API keys secure
- The MCP server respects your Supabase project's security rules

## Next Steps

1. Complete the MCP setup using the instructions above
2. Test the integration by asking database-related questions
3. Explore your database schema with AI assistance
4. Use MCP to help write queries and migrations

---

**Last Updated:** October 2025
**Project:** AI Prompt App
**Supabase Project:** gzpowgtchacjztlqewbn
