# 🔥 Essential Jikan APIs - Streamlined Catalogue

## 📊 **TOP LISTS & RANKINGS (Homepage Content)**

### **Core Top Lists** ✅
```typescript
GET /top/anime?filter=all              // 🏆 Top Rated (All Time)
GET /top/anime?filter=airing           // 📺 Top Currently Airing  
GET /top/anime?filter=upcoming         // 🔮 Top Upcoming
GET /top/anime?filter=tv               // 📻 Top TV Series
GET /top/anime?filter=movie            // 🎬 Top Movies
GET /top/anime?filter=bypopularity     // 🔥 Most Popular
GET /top/anime?filter=favorite         // ❤️ Most Loved (Favorites)
```

### **Custom "Top" Lists** ✅
```typescript
// 🆕 Recently Completed (High Rated)
GET /anime?status=complete&order_by=end_date&sort=desc&min_score=7.5

// 🎯 Hidden Gems (High rated, low popularity)
GET /anime?min_score=8.0&order_by=members&sort=asc

// 📈 Trending Now (Popular + Currently Airing)
GET /anime?status=airing&order_by=members&sort=desc

// 🏃‍♂️ Quick Watch (Short series, high rated)
GET /anime?max_episodes=12&min_score=7.0&order_by=score&sort=desc

// 🎭 Classic Anime (Older + Highly Rated)
GET /anime?start_date=1990-01-01&end_date=2010-12-31&min_score=8.0

// 🔄 Recently Added to Database
GET /anime?order_by=start_date&sort=desc

// 💎 Highest Rated Movies This Year
GET /anime?type=movie&year=2024&order_by=score&sort=desc

// 🌟 All-Time Classics (Score 9+)
GET /anime?min_score=9.0&order_by=score&sort=desc
```

---

## 🔍 **SEARCH & DISCOVERY**

### **Basic Search** ✅
```typescript
GET /anime?q={query}&limit=25&page={page}
```

### **Advanced Search with Filters** ✅
```typescript
GET /anime
  ?q={query}
  &type=tv|movie|ova|special|ona|music
  &status=airing|complete|upcoming
  &genres={genre_ids}          // e.g. 1,2,4 (Action,Adventure,Comedy)
  &genres_exclude={genre_ids}   // Exclude certain genres
  &score={min_score}
  &min_score={min}&max_score={max}
  &start_date={date}&end_date={date}
  &rating=g|pg|pg13|r17|r|rx
  &order_by=title|score|popularity|members|episodes|start_date
  &sort=asc|desc
  &limit=25&page={page}
```

---

## 📅 **SEASONAL & TEMPORAL**

### **Current & Future Seasons** ✅
```typescript
GET /seasons/now                    // 📺 Currently Airing
GET /seasons/upcoming               // 🔮 Next Season Preview
GET /seasons/{year}/{season}        // 📅 Specific Season
```

### **Schedule** ✅
```typescript
GET /schedules                      // 📋 Full Weekly Schedule
// OR choose one:
GET /schedules?filter=monday        // 📅 Specific Day Schedule
```

---

## 🎲 **DISCOVERY**

### **Random Discovery** ✅
```typescript
GET /random/anime                   // 🎲 Random Anime
```

### **Basic Recommendations** ✅
```typescript
GET /anime/{id}/recommendations     // 🤝 Similar Anime
```

---

## 🏢 **BROWSE BY CATEGORY**

### **By Genre** ✅
```typescript
GET /genres/anime                   // 📝 List All Genres
GET /anime?genres={genre_id}        // 🎨 Anime by Genre
```

### **By Studio/Producer** ✅
```typescript
GET /producers                      // 🏢 List All Studios
GET /anime?producers={producer_id}  // 🎬 Anime by Studio
```

---

## 📄 **ANIME DETAILS**

### **Essential Details** ✅
```typescript
GET /anime/{id}                     // 📖 Main Details
GET /anime/{id}/pictures            // 🖼️ Screenshots/Images  
GET /anime/{id}/videos              // 🎥 Trailers & PVs
GET /anime/{id}/statistics          // 📊 Viewing Statistics (if useful)
```

---

## 🎯 **SUGGESTED "TOP LISTS" FOR HOMEPAGE**

Here are **homepage sections** you could create:

### **Row 1: Current & Trending**
- 🔥 **Trending Now** (Popular + Airing)
- 📺 **Top Currently Airing**  
- 🆕 **Recently Added**

### **Row 2: All-Time Bests**
- 🏆 **Highest Rated**
- ❤️ **Most Loved** (Favorites)
- 🌟 **All-Time Classics** (9.0+ score)

### **Row 3: Discovery**
- 💎 **Hidden Gems** (High rated, lower popularity)
- 🎬 **Top Movies**
- 🏃‍♂️ **Quick Watch** (Short series)

### **Row 4: Categories**
- 🎭 **Classic Anime** (Pre-2010 gems)
- 🔮 **Coming Soon** (Upcoming)
- 🎲 **Random Pick** (Random discovery)

### **Row 5: Seasonal**
- 📅 **This Season** (Current season anime)
- 🗓️ **Next Season Preview**

---

## 📝 **IMPLEMENTATION PRIORITY**

### **Phase 1: Core (Must Have)**
1. Search with filters
2. Top Rated, Most Popular, Most Loved
3. Current Season & Upcoming  
4. Anime Details page
5. Random discovery

### **Phase 2: Enhancement (Nice to Have)**
6. Studio/Genre browsing
7. Custom "top" lists (Hidden gems, etc.)
8. Advanced filtering options
9. Seasonal archive (specific seasons)
10. Basic recommendations

### **Phase 3: Polish (Advanced)**
11. Statistics page
12. Multiple image galleries
13. Video trailers integration
14. Advanced sorting options

---

This gives you a **comprehensive anime catalogue** with all the essential discovery features while keeping the API simple and focused! 🚀

**Which of these "Top Lists" sound most appealing for your homepage?**